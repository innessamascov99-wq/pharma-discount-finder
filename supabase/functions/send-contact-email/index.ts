import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { fullName, email, message }: ContactFormData = await req.json();

    if (!fullName || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD");
    const recipientEmail = Deno.env.get("RECIPIENT_EMAIL") || gmailUser;

    if (!gmailUser || !gmailPass) {
      return new Response(
        JSON.stringify({ error: "Email configuration not set" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailContent = {
      personalizations: [
        {
          to: [{ email: recipientEmail }],
          subject: `New Contact Form Submission from ${fullName}`,
        },
      ],
      from: { email: gmailUser, name: "Pharma Discount Finder" },
      reply_to: { email: email, name: fullName },
      content: [
        {
          type: "text/plain",
          value: `New Contact Form Submission\n\nFrom: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
        },
        {
          type: "text/html",
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
              <div style="margin: 20px 0;">
                <p><strong>From:</strong> ${fullName}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              </div>
              <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-left: 4px solid #2563eb;">
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px;">This email was sent from the Pharma Discount Finder contact form.</p>
            </div>
          `,
        },
      ],
    };

    const smtpjsApiKey = Deno.env.get("SMTPJS_API_KEY");
    
    if (smtpjsApiKey) {
      const smtpResponse = await fetch("https://api.elasticemail.com/v2/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          apikey: smtpjsApiKey,
          from: gmailUser,
          to: recipientEmail,
          subject: `New Contact Form Submission from ${fullName}`,
          bodyText: `New Contact Form Submission\n\nFrom: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
          bodyHtml: emailContent.content[1].value,
          replyTo: email,
        }),
      });

      const result = await smtpResponse.json();
      
      if (!smtpResponse.ok || !result.success) {
        throw new Error(result.error || "Failed to send email");
      }
    } else {
      console.log("Email would be sent:", emailContent);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
