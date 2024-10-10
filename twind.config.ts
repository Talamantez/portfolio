import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      fontFamily: {
        KGCastlesCrumbling: ['KGCastlesCrumbling', 'serif'],
      },
    },
  },
} as Options;