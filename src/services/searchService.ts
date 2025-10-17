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

const performFallbackSearch = async (searchTerm: string, limit: number): Promise<PharmaProgram[]> => {
  const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(w => w.length > 1);

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

  console.log('Fallback search with conditions:', orConditions.substring(0, 100) + '...');

  const { data: fallbackData, error: fallbackError } = await supabase
    .from('pharma_programs')
    .select('*')
    .eq('active', true)
    .or(orConditions)
    .limit(50);

  if (fallbackError) {
    console.error('Fallback search failed:', fallbackError);
    throw new Error(`Database error: ${fallbackError.message}`);
  }

  if (!fallbackData || fallbackData.length === 0) {
    console.log('No results found in fallback search');
    return [];
  }

  console.log('Fallback search retrieved', fallbackData.length, 'programs');

  const results = fallbackData.map(program => {
    let relevanceScore = 0;
    const medName = (program.medication_name || '').toLowerCase();
    const genName = (program.generic_name || '').toLowerCase();
    const mfg = (program.manufacturer || '').toLowerCase();
    const progName = (program.program_name || '').toLowerCase();

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

  console.log('Fallback search completed:', sorted.length, 'results with relevance scores');
  return sorted;
};

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
  console.log('\n=== SEARCH STARTED ===' );
  console.log('Query:', searchTerm);
  console.log('Database URL:', import.meta.env.VITE_SUPABASE_URL);

  try {
    console.log('Attempting fallback search (direct table access)...');
    const results = await performFallbackSearch(searchTerm, limit);
    console.log('Search successful! Returning', results.length, 'results');
    console.log('=== SEARCH COMPLETE ===\n');
    return results;
  } catch (err: any) {
    console.error('Search failed with error:', err);
    console.log('=== SEARCH FAILED ===\n');
    throw new Error(`Search error: ${err.message || 'Unknown error'}`);
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
