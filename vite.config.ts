import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { MY_ARTICLES } from "./src/data/content"

// Writes articles.json next to the site. A GitHub Action compares it between commits
// and sends a OneSignal push notification for every new article.
const articlesFeed = () => ({
  name: "articles-feed",
  generateBundle(this: { emitFile: (f: { type: "asset"; fileName: string; source: string }) => void }) {
    const list = MY_ARTICLES.map(({ id, titleHe, excerptHe, publishedAt }) => ({ id, titleHe, excerptHe, publishedAt }))
    this.emitFile({ type: "asset", fileName: "articles.json", source: JSON.stringify(list, null, 2) })
  },
})

// The built site is written to docs/ so GitHub Pages ("main /docs") and Netlify
// can serve it as a static folder. base "./" keeps asset paths relative.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), articlesFeed()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: "docs", emptyOutDir: true },
})
