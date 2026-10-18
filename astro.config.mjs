import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://add2333.github.io",
  trailingSlash: "always",
  build: { format: "directory" },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  // Warm every internal link on hover so navigation feels instant.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [sitemap()],
});
