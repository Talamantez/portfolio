// routes/api/contact.ts
import { Handlers } from "$fresh/server.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load environment variables
const env = config();

// SendGrid API key and email address
const SENDGRID_API_KEY = env.SENDGRID_API_KEY || Deno.env.get("SENDGRID_API_KEY");
const TO_EMAIL = env.TO_EMAIL || Deno.env.get("TO_EMAIL");
const FROM_EMAIL = env.FROM_EMAIL || Deno.env.get("FROM_EMAIL");

if (!SENDGRID_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
  console.error("Missing required environment variables");
}

async function sendEmail(name: string, email: string, message: string) {
  const url = "https://api.sendgrid.com/v3/mail/send";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: TO_EMAIL }],
          subject: "New Contact Form Submission",
        },
      ],
      from: { email: FROM_EMAIL },
      content: [
        {
          type: "text/plain",
          value: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const { name, email, message } = body;

      // Log the submission (you can remove this if you don't need it)
      console.log('Received contact form submission:', { name, email, message });

      // Send email
      await sendEmail(name, email, message);

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error('Error processing contact form:', error);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};