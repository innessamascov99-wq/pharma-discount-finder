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
}

export const searchPharmaPrograms = async (query: string): Promise<PharmaProgram[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();

  try {
    const { data, error } = await supabase
      .from('pharma_programs')
      .select('*')
      .eq('active', true)
      .or(
        `medication_name.ilike.%${searchTerm}%,` +
        `generic_name.ilike.%${searchTerm}%,` +
        `manufacturer.ilike.%${searchTerm}%,` +
        `program_name.ilike.%${searchTerm}%`
      )
      .order('medication_name', { ascending: true });

    if (error) {
      console.error('Search error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected search error:', err);
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
