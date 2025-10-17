import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SearchRequest {
  query: string;
  limit?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { query, limit = 20 }: SearchRequest = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Searching for:", query);

    const lowerSearchTerm = query.toLowerCase().trim();
    const searchWords = lowerSearchTerm.split(/\s+/).filter(w => w.length > 1);

    if (searchWords.length === 0) {
      return new Response(
        JSON.stringify({
          results: [],
          count: 0,
          method: "empty_query"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const orConditions = searchWords.flatMap(word => [
      `medication_name.ilike.%${word}%`,
      `generic_name.ilike.%${word}%`,
      `manufacturer.ilike.%${word}%`,
      `program_name.ilike.%${word}%`,
      `program_description.ilike.%${word}%`
    ]).join(',');

    console.log("Search conditions:", orConditions);

    const { data, error } = await supabase
      .from('pharma_programs')
      .select('*')
      .eq('active', true)
      .or(orConditions)
      .limit(50);

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }

    console.log("Found results:", data?.length || 0);

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          results: [],
          count: 0,
          method: "text_search"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
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

    return new Response(
      JSON.stringify({
        results: sorted,
        count: sorted.length,
        method: "text_search"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});