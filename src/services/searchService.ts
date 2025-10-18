import { supabase } from '../lib/supabase';

export interface Drug {
  id: string;
  medication_name: string;
  generic_name: string;
  manufacturer: string;
  drug_class: string;
  indication: string;
  dosage_forms: string;
  common_dosages: string;
  typical_retail_price: string;
  fda_approval_date: string | null;
  description: string;
  side_effects: string;
  warnings: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  similarity?: number;
}

export interface Program {
  id: string;
  program_name: string;
  program_type: string;
  description: string;
  manufacturer: string;
  eligibility_criteria: string;
  income_requirements: string;
  insurance_requirements: string;
  discount_details: string;
  program_url: string;
  phone_number: string;
  email: string;
  enrollment_process: string;
  required_documents: string;
  coverage_duration: string;
  renewal_required: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  similarity?: number;
}

export const searchDrugs = async (query: string): Promise<Drug[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();

  try {
    const { data, error } = await supabase.rpc('search_drugs', {
      search_query: searchTerm
    });

    if (!error && data) {
      return data;
    }

    console.warn('RPC function not available, trying direct query');
  } catch (e) {
    console.warn('RPC call failed, trying direct query', e);
  }

  try {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('drugs')
      .select('*')
      .eq('active', true)
      .or(`medication_name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%,drug_class.ilike.%${searchTerm}%,indication.ilike.%${searchTerm}%`)
      .order('medication_name')
      .limit(20);

    if (!fallbackError && fallbackData) {
      return fallbackData.map(drug => ({
        ...drug,
        similarity: 0.5
      }));
    }

    console.warn('Direct query failed, using edge function');
  } catch (e) {
    console.warn('Direct query failed, using edge function', e);
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(`${supabaseUrl}/functions/v1/pharma-search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: searchTerm, type: 'drugs' })
  });

  if (!response.ok) {
    throw new Error('Search failed: Unable to connect to search service');
  }

  const result = await response.json();
  return result.drugs || [];
};

export const searchPrograms = async (query: string): Promise<Program[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();

  try {
    const { data, error } = await supabase.rpc('search_programs', {
      search_query: searchTerm
    });

    if (!error && data) {
      return data;
    }

    console.warn('RPC function not available, trying direct query');
  } catch (e) {
    console.warn('RPC call failed, trying direct query', e);
  }

  try {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('programs')
      .select('*')
      .eq('active', true)
      .or(`program_name.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('program_name')
      .limit(20);

    if (!fallbackError && fallbackData) {
      return fallbackData.map(program => ({
        ...program,
        similarity: 0.5
      }));
    }

    console.warn('Direct query failed, using edge function');
  } catch (e) {
    console.warn('Direct query failed, using edge function', e);
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(`${supabaseUrl}/functions/v1/pharma-search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: searchTerm, type: 'programs' })
  });

  if (!response.ok) {
    throw new Error('Search failed: Unable to connect to search service');
  }

  const result = await response.json();
  return result.programs || [];
};

export const getProgramsForDrug = async (drugId: string): Promise<Program[]> => {
  try {
    const { data, error } = await supabase.rpc('get_programs_for_drug', {
      drug_id_param: drugId
    });

    if (!error && data) {
      return data;
    }

    console.warn('RPC function not available, falling back to direct query');
  } catch (e) {
    console.warn('RPC call failed, using fallback', e);
  }

  const { data: joinData, error: joinError } = await supabase
    .from('drugs_programs')
    .select(`
      program_id,
      programs (*)
    `)
    .eq('drug_id', drugId);

  if (joinError) {
    console.error('Error getting programs for drug:', joinError);
    return [];
  }

  return (joinData || [])
    .filter(item => item.programs)
    .map(item => item.programs as unknown as Program);
};

export const getAllDrugs = async (): Promise<Drug[]> => {
  const { data, error } = await supabase
    .from('drugs')
    .select('*')
    .eq('active', true)
    .order('medication_name', { ascending: true });

  if (error) {
    console.error('Error fetching drugs:', error);
    throw new Error(`Failed to fetch drugs: ${error.message}`);
  }

  return data || [];
};

export const getAllPrograms = async (): Promise<Program[]> => {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('active', true)
    .order('program_name', { ascending: true });

  if (error) {
    console.error('Error fetching programs:', error);
    throw new Error(`Failed to fetch programs: ${error.message}`);
  }

  return data || [];
};

export const getDrugById = async (id: string): Promise<Drug | null> => {
  const { data, error } = await supabase
    .from('drugs')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching drug:', error);
    return null;
  }

  return data;
};

export const getProgramById = async (id: string): Promise<Program | null> => {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching program:', error);
    return null;
  }

  return data;
};

export const getDrugsByManufacturer = async (manufacturer: string): Promise<Drug[]> => {
  const { data, error } = await supabase
    .from('drugs')
    .select('*')
    .eq('active', true)
    .ilike('manufacturer', `%${manufacturer}%`)
    .order('medication_name', { ascending: true });

  if (error) {
    console.error('Error fetching drugs by manufacturer:', error);
    return [];
  }

  return data || [];
};

export const getProgramsByManufacturer = async (manufacturer: string): Promise<Program[]> => {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('active', true)
    .ilike('manufacturer', `%${manufacturer}%`)
    .order('program_name', { ascending: true });

  if (error) {
    console.error('Error fetching programs by manufacturer:', error);
    return [];
  }

  return data || [];
};
