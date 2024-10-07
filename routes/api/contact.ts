// routes/api/contact.ts
import { Handlers } from "$fresh/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const TO_EMAIL = Deno.env.get("TO_EMAIL");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");

if (!SENDGRID_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
  console.error("Missing required environment variables");
}

async function sendEmail(name: string, email: string, message: string) {
  const url = "https://api.sendgrid.com/v3/mail/send";
  const data = {
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
  };

  console.log("Sending email with data:", JSON.stringify(data));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  const responseText = await response.text();
  console.log("SendGrid API Response:", response.status, responseText);

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.status} ${response.statusText}\n${responseText}`);
  }

  console.log("Email sent successfully");
  return responseText;
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const { name, email, message } = body;

      console.log('Received contact form submission:', { name, email, message });

      const sendGridResponse = await sendEmail(name, email, message);

      return new Response(JSON.stringify({ success: true, sendGridResponse }), {
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