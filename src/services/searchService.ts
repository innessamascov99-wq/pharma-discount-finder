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
    console.log('Empty search query');
    return [];
  }

  if (query.trim().length < 2) {
    console.log('Search query too short');
    return [];
  }

  const searchTerm = query.trim();
  console.log('Searching for:', searchTerm);

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const apiUrl = `${supabaseUrl}/functions/v1/pharma-search`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchTerm,
        limit: limit
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error:', response.status, errorText);
      throw new Error(`Search failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('Search completed:', result.results?.length || 0, 'results returned');
    return result.results || [];
  } catch (err) {
    console.error('Search failed with error:', err);
    throw err;
  }
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
