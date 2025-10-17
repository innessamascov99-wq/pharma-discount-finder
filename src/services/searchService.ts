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
    console.log('Empty query, returning all programs');
    return getAllPharmaPrograms();
  }

  const searchTerm = query.trim();

  console.log('🔍 Searching for:', searchTerm);
  console.log('📊 Database URL:', 'https://nuhfqkhplldontxtoxkg.supabase.co');
  console.log('📊 Has API Key:', true);

  // Try direct text search first (most reliable)
  try {
    const results = await fallbackTextSearch(searchTerm, limit);
    console.log('✅ Text search returned:', results.length, 'results');
    if (results.length > 0) {
      return results;
    }
  } catch (err) {
    console.error('❌ Text search error:', err);
  }

  // Try vector search if text search returns nothing
  try {
    console.log('Attempting vector search...');
    return await vectorSearch(searchTerm, limit);
  } catch (err) {
    console.error('❌ Vector search failed:', err);
    // Return empty array instead of throwing
    return [];
  }
};

const vectorSearch = async (searchTerm: string, limit: number = 15): Promise<PharmaProgram[]> => {
  try {
    const supabaseUrl = 'https://nuhfqkhplldontxtoxkg.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGZxa2hwbGxkb250eHRveGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQyODYsImV4cCI6MjA3MzQ1MDI4Nn0.ceTZ_YZtqCRv2v3UCgHM42OXdb97KrmVhnxgk0iD3eE';

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
    console.log('Using optimized text search...');
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
        `program_description.ilike.%${lowerSearchTerm}%,` +
        `eligibility_criteria.ilike.%${lowerSearchTerm}%`
      );

    if (error) {
      console.error('Text search error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const results = data.map(program => {
      let relevanceScore = 0;
      const term = lowerSearchTerm;
      const medName = program.medication_name?.toLowerCase() || '';
      const genName = program.generic_name?.toLowerCase() || '';
      const manu = program.manufacturer?.toLowerCase() || '';
      const progName = program.program_name?.toLowerCase() || '';

      if (medName === term) relevanceScore += 100;
      else if (medName.startsWith(term)) relevanceScore += 80;
      else if (medName.includes(term)) relevanceScore += 40;

      if (genName === term) relevanceScore += 90;
      else if (genName.startsWith(term)) relevanceScore += 70;
      else if (genName.includes(term)) relevanceScore += 35;

      if (manu.includes(term)) relevanceScore += 20;
      if (progName.includes(term)) relevanceScore += 15;

      return {
        ...program,
        similarity: relevanceScore / 100
      };
    });

    results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

    const topResults = results.slice(0, limit);
    console.log(`Optimized search returned ${topResults.length} results`);

    return topResults;
  } catch (err) {
    console.error('Unexpected text search error:', err);
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
    console.log('📊 Fetching all programs from:', 'https://nuhfqkhplldontxtoxkg.supabase.co');

    const { data, error, count } = await supabase
      .from('pharma_programs')
      .select('*', { count: 'exact' })
      .eq('active', true)
      .order('medication_name', { ascending: true });

    if (error) {
      console.error('❌ Error fetching all programs:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }

    console.log(`✅ Successfully fetched ${count} active programs`);
    return data || [];
  } catch (err) {
    console.error('❌ Unexpected error fetching programs:', err);
    return [];
  }
};
