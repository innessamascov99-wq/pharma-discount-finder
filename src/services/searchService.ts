import { searchSupabase } from '../lib/supabase';
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

export interface PharmacyPricing {
  id: string;
  drug_id: string | null;
  drug_name: string;
  drug_type: string | null;
  pharmacy_name: string;
  price_usd: number | null;
  discount_price_usd: number | null;
  discount_description: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
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

export interface UserProgram {
  id: string;
  user_id: string;
  program_id: string;
  drug_id: string | null;
  enrollment_date: string;
  status: 'active' | 'expired' | 'cancelled';
  renewal_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  program?: Program;
  drug?: Drug;
}

const logActivity = async (actionType: string, medicationName?: string, drugId?: string, searchQuery?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      searchSupabase.rpc('log_user_activity', {
        p_action_type: actionType,
        p_medication_name: medicationName || null,
        p_drug_id: drugId || null,
        p_program_id: null,
        p_search_query: searchQuery || null,
        p_metadata: {}
      }).catch(err => {
        console.warn('Activity logging unavailable:', err.message);
      });
    }
  } catch (error) {
    console.warn('Activity logging failed:', error);
  }
};

export const searchDrugs = async (query: string): Promise<Drug[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim();

  try {
    const { data, error } = await searchSupabase
      .from('drugs')
      .select('*')
      .eq('active', true)
      .or(`medication_name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%,drug_class.ilike.%${searchTerm}%,indication.ilike.%${searchTerm}%`)
      .order('medication_name')
      .limit(20);

    if (error) throw error;

    const results = (data || []).map(drug => ({ ...drug, similarity: 0.8 }));

    if (results.length > 0) {
      await logActivity('search', results[0].medication_name, undefined, searchTerm);
    }

    return results;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

export const searchPrograms = async (query: string): Promise<Program[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim();

  try {
    const { data, error } = await searchSupabase
      .from('programs')
      .select('*')
      .eq('active', true)
      .or(`program_name.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('program_name')
      .limit(20);

    if (error) throw error;
    return (data || []).map(program => ({ ...program, similarity: 0.8 }));
  } catch (error) {
    console.error('Search programs error:', error);
    throw error;
  }
};

export const getProgramsForDrug = async (drugId: string): Promise<Program[]> => {
  try {
    const { data, error } = await searchSupabase
      .from('drugs_programs')
      .select('program_id, programs (*)')
      .eq('drug_id', drugId);

    if (error) throw error;

    const programs = (data || [])
      .filter(item => item.programs)
      .map(item => item.programs as unknown as Program);

    return programs;
  } catch (error) {
    console.error('Get programs for drug error:', error);
    throw error;
  }
};

export const getAllDrugs = async (): Promise<Drug[]> => {
  try {
    const { data, error } = await searchSupabase
      .from('drugs')
      .select('*')
      .eq('active', true)
      .order('medication_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get all drugs error:', error);
    throw error;
  }
};

export const getAllPrograms = async (): Promise<Program[]> => {
  try {
    const { data, error } = await searchSupabase
      .from('programs')
      .select('*')
      .eq('active', true)
      .order('program_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get all programs error:', error);
    throw error;
  }
};

export const getDrugById = async (id: string): Promise<Drug | null> => {
  try {
    const { data, error } = await searchSupabase
      .from('drugs')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      await logActivity('viewed', data.medication_name, data.id);
    }

    return data;
  } catch (error) {
    console.error('Get drug by id error:', error);
    throw error;
  }
};

export const getProgramById = async (id: string): Promise<Program | null> => {
  try {
    const { data, error } = await searchSupabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      await logActivity('clicked_program', data.program_name, undefined);
    }

    return data;
  } catch (error) {
    console.error('Get program by id error:', error);
    throw error;
  }
};

export const getDrugsByManufacturer = async (manufacturer: string): Promise<Drug[]> => {
  try {
    const { data, error } = await searchSupabase
      .from('drugs')
      .select('*')
      .eq('active', true)
      .ilike('manufacturer', `%${manufacturer}%`)
      .order('medication_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get drugs by manufacturer error:', error);
    throw error;
  }
};

export const getProgramsByManufacturer = async (manufacturer: string): Promise<Program[]> => {
  try {
    const { data, error } = await searchSupabase
      .from('programs')
      .select('*')
      .eq('active', true)
      .ilike('manufacturer', `%${manufacturer}%`)
      .order('program_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get programs by manufacturer error:', error);
    throw error;
  }
};

export const getPharmacyPricingForDrug = async (drugId: string): Promise<PharmacyPricing[]> => {
  try {
    const { data, error } = await searchSupabase
      .from('pharmacy_pricing')
      .select('*')
      .eq('drug_id', drugId)
      .order('price_usd', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get pharmacy pricing error:', error);
    return [];
  }
};

export const getUserPrograms = async (userId: string, status?: 'active' | 'expired' | 'cancelled'): Promise<UserProgram[]> => {
  try {
    let query = supabase
      .from('user_programs')
      .select(`
        *,
        program:programs(*),
        drug:drugs(*)
      `)
      .eq('user_id', userId)
      .order('enrollment_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get user programs error:', error);
    return [];
  }
};

export const enrollInProgram = async (
  programId: string,
  drugId?: string,
  notes?: string
): Promise<UserProgram | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_programs')
      .insert({
        user_id: user.id,
        program_id: programId,
        drug_id: drugId || null,
        notes: notes || null,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Enroll in program error:', error);
    return null;
  }
};

export const updateProgramStatus = async (
  userProgramId: string,
  status: 'active' | 'expired' | 'cancelled',
  notes?: string
): Promise<UserProgram | null> => {
  try {
    const updateData: any = { status };
    if (notes) updateData.notes = notes;

    const { data, error } = await supabase
      .from('user_programs')
      .update(updateData)
      .eq('id', userProgramId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update program status error:', error);
    return null;
  }
};
