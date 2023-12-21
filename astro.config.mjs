import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",
  base: "/custom-base",
  trailingSlash: "never",
  build: {
    assetsPrefix: import.meta.env.BASE_URL,
  },
  adapter: netlify(),
});
