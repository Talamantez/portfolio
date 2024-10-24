// routes/api/admin/kv-inspect.ts
import { Handlers } from "$fresh/server.ts";

const ADMIN_TOKEN = Deno.env.get("ADMIN_TOKEN");

export const handler: Handlers = {
  async GET(req) {
    // Basic security check
    const authHeader = req.headers.get("Authorization");
    if (!ADMIN_TOKEN || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const kv = await Deno.openKv();
    const results = [];

    try {
      // Get the prefix from query params
      const url = new URL(req.url);
      const prefix = url.searchParams.get("prefix")?.split("/") || [];
      
      const entries = kv.list({ prefix });
      
      for await (const entry of entries) {
        results.push({
          key: entry.key,
          value: entry.value,
          versionstamp: entry.versionstamp,
        });
      }

      return new Response(JSON.stringify({
        total: results.length,
        entries: results
      }, null, 2), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    } finally {
      await kv.close();
    }
  }
};