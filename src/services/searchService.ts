import { supabase } from '../lib/supabase';

export interface PharmaProgram {
  id: string;
  medication_name: string;
  generic_name: string;
  manufacturer: string;
  program_name: string;
  program_description: string;
  eligibility_criteria: string;
  discount_amount: string;
  program_url: string;
  phone_number: string;
  enrollment_process: string;
  required_documents: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  similarity?: number;
}

export interface SearchResult {
  results: PharmaProgram[];
  count: number;
  method: 'vector_search' | 'text_search' | 'fallback';
  query?: string;
}

export const searchPharmaPrograms = async (query: string, limit: number = 15): Promise<PharmaProgram[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.trim();

  try {
    return await fallbackTextSearch(searchTerm, limit);
  } catch (err) {
    console.error('Search failed:', err);
    return [];
  }
};

const vectorSearch = async (searchTerm: string, limit: number = 15): Promise<PharmaProgram[]> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(
    `${supabaseUrl}/functions/v1/pharma-search`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: searchTerm, limit }),
    }
  );

  if (!response.ok) {
    throw new Error(`Vector search failed with status: ${response.status}`);
  }

  const result = await response.json();
  return result.results || [];
};

const fallbackTextSearch = async (searchTerm: string, limit: number = 15): Promise<PharmaProgram[]> => {
  const lowerSearchTerm = searchTerm.toLowerCase();

  const { data, error } = await supabase
    .from('pharma_programs')
    .select('*')
    .eq('active', true)
    .or(
      `medication_name.ilike.%${lowerSearchTerm}%,` +
      `generic_name.ilike.%${lowerSearchTerm}%,` +
      `manufacturer.ilike.%${lowerSearchTerm}%`
    )
    .limit(limit);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  const results = data.map(program => {
    let relevanceScore = 0;
    const term = lowerSearchTerm;
    const medName = program.medication_name?.toLowerCase() || '';
    const genName = program.generic_name?.toLowerCase() || '';

    if (medName === term) relevanceScore += 100;
    else if (medName.startsWith(term)) relevanceScore += 80;
    else if (medName.includes(term)) relevanceScore += 40;

    if (genName === term) relevanceScore += 90;
    else if (genName.startsWith(term)) relevanceScore += 70;
    else if (genName.includes(term)) relevanceScore += 35;

    return {
      ...program,
      similarity: relevanceScore / 100
    };
  });

  return results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
};

export const getAllPharmaPrograms = async (): Promise<PharmaProgram[]> => {
  const { data, error } = await supabase
    .from('pharma_programs')
    .select('*')
    .eq('active', true)
    .order('medication_name', { ascending: true });

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return data || [];
};
