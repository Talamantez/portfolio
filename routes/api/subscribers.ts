// routes/api/subscribers.ts
import { Handlers } from "$fresh/server.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";
import { create } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

interface Subscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  status: "active" | "unsubscribed";
}

// Declare kv variable with explicit Deno.Kv type
let kv: Deno.Kv | null = null;

try {
  kv = await Deno.openKv("./subscribers.db");
} catch (error) {
  console.error("Failed to open KV store:", error);
  throw error;
}

const JWT_SECRET = Deno.env.get("JWT_SECRET") || crypto.randomUUID();

export const handler: Handlers = {
  async POST(req: Request) {
    if (!kv) throw new Error("KV store not initialized");

    try {
      const body = await req.json();
      const { email, firstName, lastName } = body;

      if (!email || !email.includes("@")) {
        return new Response(JSON.stringify({ error: "Invalid email" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const subscriber: Subscriber = {
        email,
        firstName,
        lastName,
        createdAt: new Date(),
        status: "active",
      };

      // Use the non-null assertion since we checked kv above
      const result = await kv.atomic()
        .set(["subscribers", email], subscriber)
        .commit();

      if (!result.ok) {
        throw new Error("Failed to save subscriber");
      }

      if (Deno.env.get("RESEND_API_KEY")) {
        await fetch("https://api.resend.com/audiences/your-audience-id/members", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
          }),
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async GET(_req: Request) {
    if (!kv) throw new Error("KV store not initialized");

    try {
      const subscribers: Subscriber[] = [];
      const iter = kv.list<Subscriber>({ prefix: ["subscribers"] });
      
      for await (const entry of iter) {
        subscribers.push(entry.value);
      }
      
      return new Response(JSON.stringify(subscribers), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};