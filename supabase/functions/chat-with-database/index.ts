import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { message, history = [] }: ChatRequest = await req.json();

    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const userMessage = message.toLowerCase();
    let response = '';

    if (userMessage.includes('drug') || userMessage.includes('medication') || userMessage.includes('medicine')) {
      const { data: drugs, error } = await supabase
        .from('drugs')
        .select('medication_name, generic_name, manufacturer, description, typical_retail_price')
        .eq('active', true)
        .limit(5);

      if (error) {
        console.error('Database error:', error);
        response = "I'm having trouble accessing the drug database right now. Please try again.";
      } else if (drugs && drugs.length > 0) {
        response = "Here are some medications we have information about:\n\n";
        drugs.forEach((drug: any, index: number) => {
          response += `${index + 1}. **${drug.medication_name}** (${drug.generic_name})\n`;
          response += `   Manufacturer: ${drug.manufacturer}\n`;
          response += `   Price: ${drug.typical_retail_price}\n\n`;
        });
        response += "You can search for specific medications using the search bar on our site.";
      } else {
        response = "I don't have any medication information available at the moment.";
      }
    } else if (userMessage.includes('program') || userMessage.includes('assistance') || userMessage.includes('discount') || userMessage.includes('help pay')) {
      const { data: programs, error } = await supabase
        .from('programs')
        .select('program_name, program_type, manufacturer, description, discount_details')
        .eq('active', true)
        .limit(5);

      if (error) {
        console.error('Database error:', error);
        response = "I'm having trouble accessing the program database right now. Please try again.";
      } else if (programs && programs.length > 0) {
        response = "Here are some assistance programs available:\n\n";
        programs.forEach((program: any, index: number) => {
          response += `${index + 1}. **${program.program_name}**\n`;
          response += `   Type: ${program.program_type}\n`;
          response += `   Manufacturer: ${program.manufacturer}\n`;
          response += `   ${program.discount_details}\n\n`;
        });
        response += "Use the search feature to find programs for your specific medication.";
      } else {
        response = "I don't have any program information available at the moment.";
      }
    } else if (userMessage.includes('search') || userMessage.includes('find')) {
      response = "You can search for medications and assistance programs using the search bar at the top of the page. Just type the name of the medication you're looking for!";
    } else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      response = "Hello! I'm Jack, your pharmacy assistance guide. I can help you:\n\n- Find information about medications\n- Discover patient assistance programs\n- Learn about discount options\n\nWhat would you like to know?";
    } else if (userMessage.includes('how') && (userMessage.includes('work') || userMessage.includes('use'))) {
      response = "Our platform helps you find affordable medication options in three easy steps:\n\n1. **Search**: Use the search bar to find your medication\n2. **Review**: See available programs and their requirements\n3. **Apply**: Get direct links to enroll in assistance programs\n\nWould you like to search for a specific medication?";
    } else {
      response = "I can help you with:\n\n- Finding medications and their details\n- Discovering patient assistance programs\n- Learning about discount opportunities\n- Understanding how our platform works\n\nWhat would you like to know more about?";
    }

    return new Response(
      JSON.stringify({
        response,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing chat:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});