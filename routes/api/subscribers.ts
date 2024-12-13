// routes/api/subscribers.ts
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    // Open KV with default configuration only
    const kv = await Deno.openKv();
    
    try {
      const body = await req.json();
      const { email, firstName, lastName } = body;
      
      if (!email || !firstName || !lastName) {
        return new Response(JSON.stringify({
          error: "Missing required fields"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Use the KV store with simple key structure
      const key = ["subscribers", email];
      const existing = await kv.get(key);
      
      if (existing.value) {
        return new Response(JSON.stringify({
          error: "Email already subscribed"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Store the subscriber
      await kv.set(key, {
        email,
        firstName,
        lastName,
        status: "active",
        createdAt: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        message: "Subscription successful"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Subscription error:", error);
      return new Response(JSON.stringify({
        error: "Failed to process subscription"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    } finally {
      await kv.close();
    }
  },

  async GET(req) {
    const kv = await Deno.openKv();
    try {
      const subscribers = [];
      const entries = kv.list({ prefix: ["subscribers"] });
      
      for await (const entry of entries) {
        subscribers.push(entry.value);
      }

      return new Response(JSON.stringify({
        subscribers
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } finally {
      await kv.close();
    }
  }
};