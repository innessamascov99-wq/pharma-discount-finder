import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface QueryRequest {
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

    if (req.method === 'POST') {
      const { query, limit = 5 }: QueryRequest = await req.json();

      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Query parameter is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);

      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (error) {
        throw error;
      }

      const scoredResults = data.map((article: any) => {
        let score = 0;
        const lowerTitle = article.title.toLowerCase();
        const lowerCategory = article.category.toLowerCase();
        const keywords = article.keywords || [];
        const symptoms = article.symptoms || [];

        searchTerms.forEach((term: string) => {
          if (lowerTitle.includes(term)) score += 10;
          if (lowerCategory.includes(term)) score += 5;
          
          keywords.forEach((keyword: string) => {
            if (keyword.toLowerCase().includes(term)) score += 8;
          });
          
          symptoms.forEach((symptom: string) => {
            if (symptom.toLowerCase().includes(term)) score += 6;
          });
        });

        return { ...article, score };
      });

      const results = scoredResults
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return new Response(
        JSON.stringify({ results, count: results.length }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ results: data, count: data.length }),
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