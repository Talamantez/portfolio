/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts"

// Open KV store
const kv = await Deno.openKv();

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import "jsr:@std/dotenv/load";
// await start(manifest, { plugins: [twindPlugin(twindConfig)] });
// @ts-ignore
await start(manifest, {
    ...config,
    plugins: [
      {
        name: "kv",
        middlewares: [
          {
            path: "/admin",
            middleware: {
              handler: async (_req, ctx) => {
                ctx.state.kv = kv;
                return await ctx.next();
              },
            },
          },
        ],
      },
      twindPlugin(twindConfig)
    ],
  });