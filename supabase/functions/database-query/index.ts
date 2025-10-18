import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QueryRequest {
  type: 'search_drugs' | 'search_programs' | 'get_all_drugs' | 'get_all_programs' | 'get_drug_by_id' | 'get_program_by_id' | 'get_programs_for_drug' | 'get_drugs_by_manufacturer' | 'get_programs_by_manufacturer';
  query?: string;
  id?: string;
  drugId?: string;
  manufacturer?: string;
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

    const { type, query, id, drugId, manufacturer }: QueryRequest = await req.json();

    console.log("Request type:", type, { query, id, drugId, manufacturer });

    let result;

    switch (type) {
      case 'search_drugs': {
        if (!query) throw new Error('Query required');
        const searchTerm = query.toLowerCase().trim();
        const { data, error } = await supabase
          .from('drugs')
          .select('*')
          .eq('active', true)
          .or(`medication_name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%,drug_class.ilike.%${searchTerm}%,indication.ilike.%${searchTerm}%`)
          .order('medication_name')
          .limit(20);
        
        if (error) throw error;
        result = { data: (data || []).map(d => ({ ...d, similarity: 0.7 })) };
        break;
      }

      case 'search_programs': {
        if (!query) throw new Error('Query required');
        const searchTerm = query.toLowerCase().trim();
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('active', true)
          .or(`program_name.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .order('program_name')
          .limit(20);
        
        if (error) throw error;
        result = { data: (data || []).map(p => ({ ...p, similarity: 0.7 })) };
        break;
      }

      case 'get_all_drugs': {
        const { data, error } = await supabase
          .from('drugs')
          .select('*')
          .eq('active', true)
          .order('medication_name');
        
        if (error) throw error;
        result = { data };
        break;
      }

      case 'get_all_programs': {
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('active', true)
          .order('program_name');
        
        if (error) throw error;
        result = { data };
        break;
      }

      case 'get_drug_by_id': {
        if (!id) throw new Error('ID required');
        const { data, error } = await supabase
          .from('drugs')
          .select('*')
          .eq('id', id)
          .eq('active', true)
          .maybeSingle();
        
        if (error) throw error;
        result = { data };
        break;
      }

      case 'get_program_by_id': {
        if (!id) throw new Error('ID required');
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('id', id)
          .eq('active', true)
          .maybeSingle();
        
        if (error) throw error;
        result = { data };
        break;
      }

      case 'get_programs_for_drug': {
        if (!drugId) throw new Error('Drug ID required');
        const { data: joinData, error } = await supabase
          .from('drugs_programs')
          .select(`
            program_id,
            programs (*)
          `)
          .eq('drug_id', drugId);
        
        if (error) throw error;
        const programs = (joinData || [])
          .filter(item => item.programs)
          .map(item => item.programs);
        result = { data: programs };
        break;
      }

      case 'get_drugs_by_manufacturer': {
        if (!manufacturer) throw new Error('Manufacturer required');
        const { data, error } = await supabase
          .from('drugs')
          .select('*')
          .eq('active', true)
          .ilike('manufacturer', `%${manufacturer}%`)
          .order('medication_name');
        
        if (error) throw error;
        result = { data };
        break;
      }

      case 'get_programs_by_manufacturer': {
        if (!manufacturer) throw new Error('Manufacturer required');
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('active', true)
          .ilike('manufacturer', `%${manufacturer}%`)
          .order('program_name');
        
        if (error) throw error;
        result = { data };
        break;
      }

      default:
        throw new Error('Invalid query type');
    }

    return new Response(
      JSON.stringify(result),
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