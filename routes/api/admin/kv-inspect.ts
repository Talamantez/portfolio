// routes/api/admin/kv-inspect.ts
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req: Request) {
    try {
      // Get the authorization header
      const authHeader = req.headers.get("Authorization");
      const adminToken = Deno.env.get("ADMIN_TOKEN");
      // Debug logging (remove in production)
      console.log("Auth check:", {
        hasAuthHeader: !!authHeader,
        expectedFormat: "Bearer " + adminToken?.slice(0, 4) + "..." // Log just first few chars
      });

      // Proper authorization check
      if (!authHeader || !adminToken) {
        console.log("Missing auth header or admin token");
        return new Response("Unauthorized - Missing credentials", { 
          status: 401,
          headers: { "Content-Type": "text/plain" }
        });
      }

      const providedToken = authHeader.replace("Bearer ", "").trim();
      if (providedToken !== adminToken) {
        return new Response(JSON.stringify({
          success: false,
          message: "Unauthorized - Invalid token"
        }), {
          status: 401,
          headers: { 
            "Content-Type": "application/json"
          }
        });
      }
      // If we get here, auth is successful
      const kv = await Deno.openKv();
      try {
        const url = new URL(req.url);
        const prefix = url.searchParams.get("prefix")?.split("/") || [];
        const results = [];
       
        const entries = kv.list({ prefix });
        for await (const entry of entries) {
          results.push({
            key: entry.key,
            value: entry.value,
            versionstamp: entry.versionstamp
          });
        }
        return new Response(JSON.stringify({
          success: true,
          message: "Authentication successful",
          total: results.length,
          entries: results
        }, null, 2), {
          headers: { "Content-Type": "application/json" }
        });
      } finally {
        await kv.close();
      }
    } catch (error) {
      console.error("KV inspection error:", error);
      return new Response(JSON.stringify({
        success: false,
        message: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};