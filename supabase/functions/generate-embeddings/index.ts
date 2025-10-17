import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    console.log("Starting embedding generation for pharma programs...");

    const { data: programs, error: fetchError } = await supabase
      .from("pharma_programs")
      .select("*")
      .eq("active", true)
      .is("embedding", null);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${programs?.length || 0} programs needing embeddings`);

    if (!programs || programs.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: "No programs need embeddings",
          updated: 0
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const model = new Supabase.ai.Session("gte-small");
    let successCount = 0;
    let errorCount = 0;

    for (const program of programs) {
      try {
        const searchText = [
          program.medication_name,
          program.generic_name,
          program.manufacturer,
          program.program_name,
          program.program_description,
          program.eligibility_criteria
        ]
          .filter(Boolean)
          .join(" ");

        console.log(`Generating embedding for: ${program.medication_name}`);

        const embedding = await model.run(searchText, { 
          mean_pool: true, 
          normalize: true 
        });

        const { error: updateError } = await supabase
          .from("pharma_programs")
          .update({ embedding: embedding })
          .eq("id", program.id);

        if (updateError) {
          console.error(`Error updating ${program.medication_name}:`, updateError);
          errorCount++;
        } else {
          console.log(`Successfully updated ${program.medication_name}`);
          successCount++;
        }
      } catch (error) {
        console.error(`Error processing ${program.medication_name}:`, error);
        errorCount++;
      }
    }

    console.log(`Completed: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        message: "Embeddings generated successfully",
        total: programs.length,
        success: successCount,
        errors: errorCount
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