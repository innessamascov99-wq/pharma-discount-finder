import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, x-client-info, apikey, authorization",
  "Access-Control-Max-Age": "86400",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let body;
    try {
      body = await req.json();
    } catch (e) {
      throw new Error("Invalid JSON in request body");
    }

    const { type, query, id, drugId, manufacturer } = body;

    console.log("Request:", type, { query, id, drugId, manufacturer });

    let result;

    if (type === 'search_drugs') {
      const searchTerm = (query || '').toLowerCase().trim();
      const { data, error } = await supabase
        .from('drugs')
        .select('*')
        .eq('active', true)
        .or(`medication_name.ilike.%${searchTerm}%,generic_name.ilike.%${searchTerm}%,drug_class.ilike.%${searchTerm}%,indication.ilike.%${searchTerm}%`)
        .order('medication_name')
        .limit(20);
      
      if (error) throw error;
      result = { data: (data || []).map(d => ({ ...d, similarity: 0.7 })) };
    }
    else if (type === 'search_programs') {
      const searchTerm = (query || '').toLowerCase().trim();
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('active', true)
        .or(`program_name.ilike.%${searchTerm}%,manufacturer.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('program_name')
        .limit(20);
      
      if (error) throw error;
      result = { data: (data || []).map(p => ({ ...p, similarity: 0.7 })) };
    }
    else if (type === 'get_all_drugs') {
      const { data, error } = await supabase.from('drugs').select('*').eq('active', true).order('medication_name');
      if (error) throw error;
      result = { data };
    }
    else if (type === 'get_all_programs') {
      const { data, error } = await supabase.from('programs').select('*').eq('active', true).order('program_name');
      if (error) throw error;
      result = { data };
    }
    else if (type === 'get_drug_by_id') {
      const { data, error } = await supabase.from('drugs').select('*').eq('id', id).eq('active', true).maybeSingle();
      if (error) throw error;
      result = { data };
    }
    else if (type === 'get_program_by_id') {
      const { data, error } = await supabase.from('programs').select('*').eq('id', id).eq('active', true).maybeSingle();
      if (error) throw error;
      result = { data };
    }
    else if (type === 'get_programs_for_drug') {
      const { data: joinData, error } = await supabase.from('drugs_programs').select('program_id, programs (*)').eq('drug_id', drugId);
      if (error) throw error;
      const programs = (joinData || []).filter(item => item.programs).map(item => item.programs);
      result = { data: programs };
    }
    else if (type === 'get_drugs_by_manufacturer') {
      const { data, error } = await supabase.from('drugs').select('*').eq('active', true).ilike('manufacturer', `%${manufacturer}%`).order('medication_name');
      if (error) throw error;
      result = { data };
    }
    else if (type === 'get_programs_by_manufacturer') {
      const { data, error } = await supabase.from('programs').select('*').eq('active', true).ilike('manufacturer', `%${manufacturer}%`).order('program_name');
      if (error) throw error;
      result = { data };
    }
    else {
      throw new Error('Invalid query type: ' + type);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});