// routes/api/debug-session.ts
import { Handlers } from "$fresh/server.ts";
import { getSession } from "../../middleware/session.ts";

export const handler: Handlers = {
  async GET(req) {
    const session = await getSession(req);
    return new Response(JSON.stringify(session, null, 2), {
      headers: { "Content-Type": "application/json" }
    });
  }
};