import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = "/";

async function createServer() {
  const app = express();

  let vite;
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      base
    });
    app.use(vite.middlewares);
  } else {
    app.use(base, express.static(path.resolve(__dirname, "dist/client"), { index: false }));
  }

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");
      let template;
      let render;

      if (!isProd) {
        template = await fs.readFile(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
      } else {
        template = await fs.readFile(path.resolve(__dirname, "dist/client/index.html"), "utf-8");
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const appHtml = render(url);
      const html = template.replace("<!--ssr-outlet-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      if (vite) {
        vite.ssrFixStacktrace(error);
      }
      console.error(error);
      res.status(500).end(error.message);
    }
  });

  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`);
  });
}

createServer();
