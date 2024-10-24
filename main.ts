/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import dev from "$fresh/dev.ts";
import "jsr:@std/dotenv/load";
await dev(import.meta.url, "./main.ts");
await start(manifest, { plugins: [twindPlugin(twindConfig)] });