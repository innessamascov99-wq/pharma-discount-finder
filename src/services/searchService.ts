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

export const searchPharmaPrograms = async (query: string): Promise<PharmaProgram[]> => {
  if (!query || query.trim().length === 0) {
    return getAllPharmaPrograms();
  }

  const searchTerm = query.trim();

  try {
    console.log('Performing direct text search for:', searchTerm);
    return await fallbackTextSearch(searchTerm);
  } catch (err) {
    console.error('Search error:', err);
    return [];
  }
};

const fallbackTextSearch = async (searchTerm: string): Promise<PharmaProgram[]> => {
  try {
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
      .limit(20);

    if (error) {
      console.error('Fallback search error:', error);
      return [];
    }

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
