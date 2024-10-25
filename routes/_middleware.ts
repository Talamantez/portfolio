// routes/_middleware.ts
import { FreshContext } from "$fresh/server.ts";
import { State } from "../middleware/auth.ts";
import * as kvMiddleware from "../middleware/kv.ts";
import * as authMiddleware from "../middleware/auth.ts";
import { serveDir } from "https://deno.land/std@0.140.0/http/file_server.ts";

const staticDir = "static";

// Helper function to set content type headers
function setContentTypeHeaders(response: Response, pathname: string): Response {
  const headers = new Headers(response.headers);

  if (pathname.endsWith(".js")) {
    headers.set("Content-Type", "application/javascript");
  } else if (pathname.endsWith(".js.map")) {
    headers.set("Content-Type", "application/json");
  }

  return new Response(response.body, {
    status: response.status,
    headers: headers,
  });
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
): Promise<Response> {
  try {
    // Log request information
    // console.log(`[Middleware] Request URL: ${req.url}`);
    // console.log(`[Middleware] Destination: ${ctx.destination}`);

    const url = new URL(req.url);
    const pathname = url.pathname;

    // Block forbidden extensions
    const forbiddenExtensions = [".php", ".gz", ".env"];
    const forbiddenPaths = ["credentials"];

    const isBlocked = forbiddenExtensions.some((ext) =>
      pathname.endsWith(ext)
    ) ||
      forbiddenPaths.some((path) => pathname.endsWith(path));

    if (isBlocked) {
      return new Response("Access denied. Request not allowed.", {
        status: 403,
      });
    }

    // Handle static files
    if (pathname.startsWith("/static/")) {
      return await serveDir(req, {
        fsRoot: staticDir,
        urlRoot: "static",
        showDirListing: true,
        enableCors: true,
      });
    }

    // Handle KV middleware
    if (ctx.destination === "route") {
      const kvResp = await kvMiddleware.handler(req, ctx);
      if (kvResp.status !== 200) {
        return setContentTypeHeaders(kvResp, pathname);
      }
    }

    // Handle admin routes authentication
    if (pathname.startsWith("/admin")) {
      const authResp = await authMiddleware.handler(req, ctx);
      if (authResp.status !== 200) {
        return setContentTypeHeaders(authResp, pathname);
      }
    }

    // Process the main request
    const response = await ctx.next();
    const headers = new Headers(response.headers);

    // Add CORS headers
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return setContentTypeHeaders(response, pathname);
  } catch (error) {
    console.error("[Middleware Error]:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
