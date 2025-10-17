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
    const results = await textSearch(searchTerm, limit);
    console.log('Search completed:', results.length, 'results returned');
    return results;
  } catch (err) {
    console.error('Search failed with error:', err);
    throw err;
  }
};

const textSearch = async (searchTerm: string, limit: number = 20): Promise<PharmaProgram[]> => {
  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  const searchWords = lowerSearchTerm.split(/\s+/).filter(w => w.length > 1);

  console.log('=== Search Debug ===');
  console.log('Original term:', searchTerm);
  console.log('Lowercase term:', lowerSearchTerm);
  console.log('Search words:', searchWords);

  if (searchWords.length === 0) {
    console.log('No valid search words after filtering');
    return [];
  }

  const orConditions = searchWords.flatMap(word => [
    `medication_name.ilike.%${word}%`,
    `generic_name.ilike.%${word}%`,
    `manufacturer.ilike.%${word}%`,
    `program_name.ilike.%${word}%`,
    `program_description.ilike.%${word}%`
  ]).join(',');

  console.log('OR conditions:', orConditions);
  console.log('Supabase URL:', supabase.supabaseUrl);

  const { data, error } = await supabase
    .from('pharma_programs')
    .select('*')
    .eq('active', true)
    .or(orConditions)
    .limit(50);

  console.log('Query response - Error:', error);
  console.log('Query response - Data length:', data?.length || 0);

  if (error) {
    console.error('Database error details:', JSON.stringify(error, null, 2));
    throw error;
  }

  if (data && data.length > 0) {
    console.log('First result sample:', {
      medication: data[0].medication_name,
      generic: data[0].generic_name,
      manufacturer: data[0].manufacturer
    });
  }

  if (!data || data.length === 0) {
    return [];
  }

  const results = data.map(program => {
    let relevanceScore = 0;
    const medName = program.medication_name?.toLowerCase() || '';
    const genName = program.generic_name?.toLowerCase() || '';
    const mfg = program.manufacturer?.toLowerCase() || '';
    const progName = program.program_name?.toLowerCase() || '';

    searchWords.forEach(word => {
      if (medName === word) relevanceScore += 100;
      else if (medName.startsWith(word)) relevanceScore += 80;
      else if (medName.includes(word)) relevanceScore += 50;

      if (genName === word) relevanceScore += 90;
      else if (genName.startsWith(word)) relevanceScore += 70;
      else if (genName.includes(word)) relevanceScore += 40;

      if (mfg.includes(word)) relevanceScore += 30;
      if (progName.includes(word)) relevanceScore += 20;
    });

    return {
      ...program,
      similarity: relevanceScore / 100
    };
  });

  const sorted = results
    .filter(r => r.similarity && r.similarity > 0)
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
    .slice(0, limit);

  return sorted;
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
