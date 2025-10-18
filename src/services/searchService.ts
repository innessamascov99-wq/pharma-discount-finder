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

  const searchTerm = query.trim();
  const searchPattern = `%${searchTerm}%`;

  const { data, error } = await supabase
    .from('drugs')
    .select('*')
    .eq('active', true)
    .or(`medication_name.ilike.${searchPattern},generic_name.ilike.${searchPattern},drug_class.ilike.${searchPattern},indication.ilike.${searchPattern}`)
    .order('medication_name')
    .limit(20);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(d => ({ ...d, similarity: 0.7 }));
};

export const searchPrograms = async (query: string): Promise<Program[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim();

  const { data, error } = await supabase
    .rpc('search_programs_rpc', { search_query: searchTerm });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(p => ({ ...p, similarity: 0.7 }));
};

export const getProgramsForDrug = async (drugId: string): Promise<Program[]> => {
  const { data, error } = await supabase
    .rpc('get_programs_for_drug_rpc', { drug_uuid: drugId });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(p => ({ ...p, similarity: 0.7 }));
};

export const getAllDrugs = async (): Promise<Drug[]> => {
  const { data, error } = await supabase
    .rpc('get_all_drugs_rpc');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const getAllPrograms = async (): Promise<Program[]> => {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('active', true)
    .order('program_name');

  if (error) {
    throw new Error(error.message);
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
    throw new Error(error.message);
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
    throw new Error(error.message);
  }

  return data;
};

export const getDrugsByManufacturer = async (manufacturer: string): Promise<Drug[]> => {
  const { data, error } = await supabase
    .from('drugs')
    .select('*')
    .eq('active', true)
    .ilike('manufacturer', `%${manufacturer}%`)
    .order('medication_name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const getProgramsByManufacturer = async (manufacturer: string): Promise<Program[]> => {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('active', true)
    .ilike('manufacturer', `%${manufacturer}%`)
    .order('program_name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};
