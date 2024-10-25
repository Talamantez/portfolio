// routes/admin/_middleware.ts
import { FreshContext } from "$fresh/server.ts";
import { getSession } from "../../../middleware/session.ts";

interface State {
  session: {
    isAdmin: boolean;
    username: string;
  } | null;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>
) {
  // Debug the incoming request
  console.log("[Admin Middleware] Processing request:", req.url);
  
  // Debug cookies
  const cookies = req.headers.get("cookie");
  console.log("[Admin Middleware] Cookies received:", cookies);

  const session = await getSession(req);
  console.log("[Admin Middleware] Session data:", session);

  if (!session?.isAdmin) {
    console.log("[Admin Middleware] No valid session, redirecting to login");
    const url = new URL(req.url);
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("redirect", url.pathname);
    return new Response("", {
      status: 303,
      headers: { Location: loginUrl.toString() }
    });
  }

  // Store session in context state
  ctx.state.session = session;
  console.log("[Admin Middleware] Valid session found, proceeding to:", req.url);

  return await ctx.next();
}