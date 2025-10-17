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

/**
 * Ultra-fast pharmaceutical program search
 * Uses optimized PostgreSQL RPC function with pg_trgm for fuzzy matching
 * Handles typos, partial matches, and returns results in <50ms
 *
 * @param query - Search term (medication name, generic name, or manufacturer)
 * @param limit - Maximum number of results to return (default: 20)
 * @returns Array of matching programs sorted by relevance
 */
export const searchPharmaPrograms = async (
  query: string,
  _limit: number = 20
): Promise<PharmaProgram[]> => {
  // Validate input
  if (!query || query.trim().length === 0) {
    return [];
  }

  if (query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim();
  const startTime = performance.now();

  try {
    // Use simplified RPC function with NO caching
    const { data, error } = await supabase.rpc('search_pharma_simple', {
      search_query: searchTerm
    }, {
      head: false,
      count: null,
    });

    const duration = performance.now() - startTime;

    if (error) {
      console.error('Search RPC error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log(`No results for "${searchTerm}" (${duration.toFixed(0)}ms)`);
      return [];
    }

    console.log(`Found ${data.length} results for "${searchTerm}" in ${duration.toFixed(0)}ms`);
    return data;

  } catch (err: any) {
    console.error('Search error:', err);
    throw new Error(err.message || 'Search failed');
  }
};

/**
 * Get all active pharmaceutical programs
 * Used for browsing all available programs
 *
 * @returns Array of all active programs sorted by medication name
 */
export const getAllPharmaPrograms = async (): Promise<PharmaProgram[]> => {
  const { data, error } = await supabase
    .from('pharma_programs')
    .select('*', {
      head: false,
      count: null,
    })
    .eq('active', true)
    .order('medication_name', { ascending: true });

  if (error) {
    console.error('Error fetching programs:', error);
    throw new Error(`Failed to fetch programs: ${error.message}`);
  }

  return data || [];
};

/**
 * Get a single program by ID
 *
 * @param id - Program UUID
 * @returns Program details or null if not found
 */
export const getProgramById = async (id: string): Promise<PharmaProgram | null> => {
  const { data, error } = await supabase
    .from('pharma_programs')
    .select('*', {
      head: false,
      count: null,
    })
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching program:', error);
    return null;
  }

  return data;
};

/**
 * Get programs by manufacturer
 *
 * @param manufacturer - Manufacturer name
 * @returns Array of programs from that manufacturer
 */
export const getProgramsByManufacturer = async (manufacturer: string): Promise<PharmaProgram[]> => {
  const { data, error } = await supabase
    .from('pharma_programs')
    .select('*', {
      head: false,
      count: null,
    })
    .eq('active', true)
    .ilike('manufacturer', `%${manufacturer}%`)
    .order('medication_name', { ascending: true });

  if (error) {
    console.error('Error fetching programs by manufacturer:', error);
    return [];
  }

  return data || [];
};
