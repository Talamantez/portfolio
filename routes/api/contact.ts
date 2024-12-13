// routes/api/contact.ts
import { Handlers } from "$fresh/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const TO_EMAIL = Deno.env.get("TO_EMAIL");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");

if (!SENDGRID_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
  console.error("Missing required environment variables");
}

async function sendEmail(to: string, subject: string, content: string) {
  const url = "https://api.sendgrid.com/v3/mail/send";
  const data = {
    personalizations: [{ to: [{ email: to }], subject: subject }],
    from: { email: FROM_EMAIL },
    content: [{ type: "text/plain", value: content }],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${response.status} ${response.statusText}\n${errorText}`);
  }

  return await response.text();
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const { name, email, message } = body;

      console.log('Received contact form submission:', { name, email, message });

      // Send notification to company
      await sendEmail(
        TO_EMAIL,
        "New Contact Form Submission",
        `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      );

      // Send auto-response to user
      const autoResponseSubject = "Thank you for contacting Conscious Robot";
      const autoResponseContent = `Dear ${name},

Thank you for reaching out to Conscious Robot. We have received your message and appreciate your interest in our services.

Our team will review your inquiry and get back to you as soon as possible, typically within 1-2 business days.

Here's a summary of the information you provided:
Name: ${name}
Email: ${email}
Message: ${message}

If you need immediate assistance or have any additional questions, please don't hesitate to reply to this email.

Best regards,
The Conscious Robot Team`;

      await sendEmail(email, autoResponseSubject, autoResponseContent);

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