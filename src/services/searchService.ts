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

const fallbackTextSearch = async (searchTerm: string, limit: number = 20): Promise<PharmaProgram[]> => {
  const lowerSearchTerm = searchTerm.toLowerCase().trim();

  const searchWords = lowerSearchTerm.split(/\s+/).filter(w => w.length > 0);

  const orConditions = searchWords.flatMap(word => [
    `medication_name.ilike.%${word}%`,
    `generic_name.ilike.%${word}%`,
    `manufacturer.ilike.%${word}%`,
    `program_name.ilike.%${word}%`,
    `program_description.ilike.%${word}%`
  ]).join(',');

  const { data, error } = await supabase
    .from('pharma_programs')
    .select('*')
    .eq('active', true)
    .or(orConditions)
    .limit(50);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  const results = data.map(program => {
    let relevanceScore = 0;
    const medName = program.medication_name?.toLowerCase() || '';
    const genName = program.generic_name?.toLowerCase() || '';
    const mfg = program.manufacturer?.toLowerCase() || '';
    const progName = program.program_name?.toLowerCase() || '';

    searchWords.forEach(word => {
      if (medName === word) relevanceScore += 100;
      else if (medName.startsWith(word)) relevanceScore += 80;
      else if (medName.includes(word)) relevanceScore += 50;

      if (genName === word) relevanceScore += 90;
      else if (genName.startsWith(word)) relevanceScore += 70;
      else if (genName.includes(word)) relevanceScore += 40;

      if (mfg.includes(word)) relevanceScore += 30;
      if (progName.includes(word)) relevanceScore += 20;
    });

    return {
      ...program,
      similarity: relevanceScore / 100
    };
  });

  const sorted = results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  return sorted.slice(0, limit);
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
