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
    const { data, error } = await supabase.rpc('search_pharma_programs', {
      search_query: searchTerm,
      result_limit: limit
    });

    if (error) {
      console.error('RPC search error:', error);
      console.log('Note: If you see a schema cache error, the Supabase project needs to be restarted from the dashboard');
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No results found');
      return [];
    }

    console.log('Search completed:', data.length, 'results returned');
    return data;
  } catch (err) {
    console.error('Search failed with error:', err);
    return [];
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
