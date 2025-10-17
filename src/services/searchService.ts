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
    return getAllPharmaPrograms();
  }

  const searchTerm = query.trim();

  console.log('🔍 Searching for:', searchTerm);
  console.log('📊 Database URL:', import.meta.env.VITE_SUPABASE_URL);

  // Try direct text search first (edge function may not be deployed)
  try {
    const results = await fallbackTextSearch(searchTerm, limit);
    if (results.length > 0) {
      console.log('✅ Found', results.length, 'results via text search');
      return results;
    }
  } catch (err) {
    console.error('Text search error:', err);
  }

  // Try vector search if text search returns nothing
  try {
    console.log('Attempting vector search...');
    return await vectorSearch(searchTerm, limit);
  } catch (err) {
    console.error('Vector search failed:', err);
    return [];
  }
};

const vectorSearch = async (searchTerm: string, limit: number = 15): Promise<PharmaProgram[]> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not configured, using fallback search');
      throw new Error('Missing Supabase credentials');
    }

    console.log('Calling pharma-search edge function...');

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
      const errorText = await response.text();
      console.error('Edge function error:', response.status, errorText);
      throw new Error(`Search failed: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Vector search returned ${result.count} results using ${result.method}`);

    return result.results || [];
  } catch (err) {
    console.error('Vector search error:', err);
    throw err;
  }
};

const fallbackTextSearch = async (searchTerm: string, limit: number = 15): Promise<PharmaProgram[]> => {
  try {
    console.log('Using fallback text search...');
    const lowerSearchTerm = searchTerm.toLowerCase();

    const { data, error } = await supabase
      .from('pharma_programs')
      .select('*')
      .eq('active', true)
      .or(
        `medication_name.ilike.%${lowerSearchTerm}%,` +
        `generic_name.ilike.%${lowerSearchTerm}%,` +
        `manufacturer.ilike.%${lowerSearchTerm}%,` +
        `program_name.ilike.%${lowerSearchTerm}%,` +
        `program_description.ilike.%${lowerSearchTerm}%`
      )
      .order('medication_name', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Fallback search error:', error);
      return [];
    }

    console.log(`Fallback search returned ${data?.length || 0} results`);
    return data || [];
  } catch (err) {
    console.error('Unexpected fallback search error:', err);
    return [];
  }
};

export const searchPharmaWithFullText = async (query: string): Promise<PharmaProgram[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('pharma_programs')
      .select('*')
      .eq('active', true)
      .textSearch(
        'fts',
        query,
        {
          type: 'websearch',
          config: 'english'
        }
      )
      .order('medication_name', { ascending: true });

    if (error) {
      console.error('Full-text search error:', error);
      return searchPharmaPrograms(query);
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected full-text search error:', err);
    return searchPharmaPrograms(query);
  }
};

export const getAllPharmaPrograms = async (): Promise<PharmaProgram[]> => {
  try {
    const { data, error } = await supabase
      .from('pharma_programs')
      .select('*')
      .eq('active', true)
      .order('medication_name', { ascending: true });

    if (error) {
      console.error('Error fetching all programs:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching programs:', err);
    return [];
  }
};
