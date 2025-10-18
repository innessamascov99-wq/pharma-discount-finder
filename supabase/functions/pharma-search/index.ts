import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SearchRequest {
  query?: string;
  drugId?: string;
  type?: 'drugs' | 'programs' | 'both' | 'programs_for_drug';
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

    const { query, drugId, type = 'both', limit = 20 }: SearchRequest = await req.json();

    console.log("Request:", { query, drugId, type });

    // Handle programs_for_drug type
    if (type === 'programs_for_drug' && drugId) {
      const { data: joinData, error: joinError } = await supabase
        .from('drugs_programs')
        .select(`
          program_id,
          programs (*)
        `)
        .eq('drug_id', drugId);

      if (joinError) {
        console.error("Programs for drug error:", joinError);
        return new Response(
          JSON.stringify({ programs: [] }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const programs = (joinData || [])
        .filter(item => item.programs)
        .map(item => item.programs);

      return new Response(
        JSON.stringify({ programs }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Require query for search types
    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const searchTerm = query.toLowerCase().trim();
    const results: any = { drugs: [], programs: [] };

    // Search drugs
    if (type === 'drugs' || type === 'both') {
      const { data: drugsData, error: drugsError } = await supabase
        .from('drugs')
        .select('*')
        .eq('active', true)
        .or(`medication_name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%,drug_class.ilike.%${searchTerm}%,indication.ilike.%${searchTerm}%`)
        .order('medication_name')
        .limit(limit);

      if (drugsError) {
        console.error("Drugs search error:", drugsError);
      } else {
        results.drugs = (drugsData || []).map(drug => ({
          ...drug,
          similarity: 0.8
        }));
      }
    }

    // Search programs
    if (type === 'programs' || type === 'both') {
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .eq('active', true)
        .or(`program_name.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('program_name')
        .limit(limit);

      if (programsError) {
        console.error("Programs search error:", programsError);
      } else {
        results.programs = (programsData || []).map(program => ({
          ...program,
          similarity: 0.8
        }));
      }
    }

    return new Response(
      JSON.stringify({
        drugs: results.drugs,
        programs: results.programs,
        count: {
          drugs: results.drugs.length,
          programs: results.programs.length,
          total: results.drugs.length + results.programs.length
        }
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