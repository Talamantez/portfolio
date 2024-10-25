// fresh.config.ts
import { defineConfig } from "$fresh/server.ts";
import { State, handler as authHandler } from "./middleware/auth.ts";

export default defineConfig<State>({
  plugins: [
    {
      name: "auth",
      middlewares: [
        {
          path: "/",
          middleware: {
            handler: async (_req, ctx) => {
              if (!ctx.state.kv) {
                ctx.state.kv = await Deno.openKv();
              }
              return await ctx.next();
            },
          },
        },
        {
          path: "/",
          middleware: authHandler,
        },
      ],
    },
  ],
});