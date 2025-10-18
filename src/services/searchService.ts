import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callEdgeFunction(type: string, params: any = {}) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/db-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ type, ...params })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Database query failed');
  }

  const result = await response.json();
  return result.data;
}

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

  return await callEdgeFunction('search_drugs', { query: query.trim() });
};

export const searchPrograms = async (query: string): Promise<Program[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  return await callEdgeFunction('search_programs', { query: query.trim() });
};

export const getProgramsForDrug = async (drugId: string): Promise<Program[]> => {
  return await callEdgeFunction('get_programs_for_drug', { drugId });
};

export const getAllDrugs = async (): Promise<Drug[]> => {
  return await callEdgeFunction('get_all_drugs');
};

export const getAllPrograms = async (): Promise<Program[]> => {
  return await callEdgeFunction('get_all_programs');
};

export const getDrugById = async (id: string): Promise<Drug | null> => {
  return await callEdgeFunction('get_drug_by_id', { id });
};

export const getProgramById = async (id: string): Promise<Program | null> => {
  return await callEdgeFunction('get_program_by_id', { id });
};

export const getDrugsByManufacturer = async (manufacturer: string): Promise<Drug[]> => {
  return await callEdgeFunction('get_drugs_by_manufacturer', { manufacturer });
};

export const getProgramsByManufacturer = async (manufacturer: string): Promise<Program[]> => {
  return await callEdgeFunction('get_programs_by_manufacturer', { manufacturer });
};
