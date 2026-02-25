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

  app.get("/api/profile", (_, res) => {
    res.json({
      name: "Dongryul Kim",
      role: "Frontend Engineer",
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 37).toISOString()
    });
  });

  app.get("/api/notices", (_, res) => {
    res.json([
      { id: 1, title: "Deploy window: Tue 02:00 UTC", level: "info" },
      { id: 2, title: "Payment API latency detected", level: "warning" },
      { id: 3, title: "Q1 release checklist updated", level: "info" }
    ]);
  });

  app.get("/api/stats", (_, res) => {
    res.json({
      activeUsers: 1240,
      conversionRate: 3.7,
      serverTime: new Date().toISOString()
    });
  });

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

      const apiBase = `${req.protocol}://${req.get("host")}`;
      const { appHtml, initialData } = await render(url, { apiBase });
      const initialDataScript = `<script>window.__INITIAL_DATA__=${JSON.stringify(initialData).replace(/</g, "\\u003c")}</script>`;
      const html = template
        .replace("<!--ssr-outlet-->", appHtml)
        .replace("<!--initial-data-->", initialDataScript);

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
