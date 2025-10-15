import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { Session } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface SearchRequest {
  query: string;
  limit?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (req.method === 'POST') {
      const { query, limit = 10 }: SearchRequest = await req.json();

      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Query parameter is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log('Searching for:', query);

      // Generate embedding using Supabase AI
      const model = new Supabase.ai.Session('gte-small');
      const embedding = await model.run(query, { mean_pool: true, normalize: true });

      console.log('Generated embedding, length:', embedding.length);

      // Perform vector similarity search
      const { data: vectorResults, error: vectorError } = await supabase
        .rpc('search_pharma_programs_vector', {
          query_embedding: embedding,
          match_threshold: 0.2,
          match_count: limit,
        });

      if (vectorError) {
        console.error('Vector search error:', vectorError);
        
        // Fallback to text search if vector search fails
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('pharma_programs')
          .select('*')
          .eq('active', true)
          .or(
            searchTerms
              .map(term => 
                `medication_name.ilike.%${term}%,` +
                `generic_name.ilike.%${term}%,` +
                `manufacturer.ilike.%${term}%,` +
                `program_name.ilike.%${term}%`
              )
              .join(',')
          )
          .limit(limit);

        if (fallbackError) {
          throw fallbackError;
        }

        return new Response(
          JSON.stringify({ 
            results: fallbackData || [], 
            count: fallbackData?.length || 0,
            method: 'text_search'
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log('Vector search results:', vectorResults?.length || 0);

      return new Response(
        JSON.stringify({ 
          results: vectorResults || [], 
          count: vectorResults?.length || 0,
          method: 'vector_search'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
