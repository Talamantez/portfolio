import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import { Kv } from "kv";

export default defineConfig({
  plugins: [twindPlugin(twindConfig)],
  server: {
    port: 8000
  },
  kv: {
    kv: await Kv.openDefault(),
  },
  static: {
    // This will serve files from the static directory
    prefix: "/",
  },
});