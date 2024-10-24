// routes/api/test-env.ts
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: async (_req, _ctx) => {
    console.log('GET request received');
    try {
      const key = Deno.env.get("RESEND_API_KEY");
      console.log('Environment test:', {
        hasKey: !!key,
        keyStart: key ? key.slice(0, 5) + "..." : null
      });
      
      return new Response(JSON.stringify({
        hasKey: !!key,
        keyStart: key ? key.slice(0, 5) + "..." : null
      }), {
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }
};