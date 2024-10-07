// routes/api/contact.ts
import { useState } from "preact/hooks";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    const body = await req.json();
    const { name, email, message } = body;

    // Here you would typically send an email or save to a database
    console.log('Received contact form submission:', { name, email, message });

    // For demonstration, we're just logging the data
    // In a real application, you'd want to add proper error handling and actually send the email

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
