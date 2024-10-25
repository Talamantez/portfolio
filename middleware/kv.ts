// middleware/kv.ts
import { FreshContext } from "$fresh/server.ts";

interface State {
  kv?: Deno.Kv;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>
): Promise<Response> {
  try {
    // Initialize KV if it doesn't exist
    if (!ctx.state.kv) {
      // console.log("[KV Middleware] Initializing KV connection...");
      ctx.state.kv = await Deno.openKv();
      // console.log("[KV Middleware] KV connection established");
    }

    // Add debug logging
    // console.log("[KV Middleware] KV state:", !!ctx.state.kv);
    
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("[KV Middleware Error]:", error);
    console.error("[KV Middleware Stack]:", error.stack);
    return new Response("Database initialization error", { 
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      }
    });
  }
}