// @ts-check
import { defineConfig } from "astro/config";

import solidJs from "@astrojs/solid-js";

export default defineConfig({
  site: "https://victorpass.dev",
  integrations: [solidJs()],
});