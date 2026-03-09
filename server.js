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

  app.get("/api/posts/:postId", (req, res) => {
    const { postId } = req.params;
    res.json({
      id: postId,
      title: `Post ${postId}: SSR + CSR composition`,
      body: "이 본문은 서버에서 렌더링되는 데이터입니다."
    });
  });

  app.get("/api/posts/:postId/comments", (req, res) => {
    const { postId } = req.params;
    res.json([
      { id: `${postId}-c1`, author: "alice", text: "SSR comments are indexed in source." },
      { id: `${postId}-c2`, author: "bob", text: "Hydration keeps this markup interactive." }
    ]);
  });

  app.get("/api/posts/:postId/reactions", (req, res) => {
    const { postId } = req.params;
    const seed = Number.parseInt(postId, 10) || 7;
    res.json({ likes: 100 + (seed % 17) });
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
      const apiBase = `${req.protocol}://${req.get("host")}`;
      const pathname = new URL(req.originalUrl, apiBase).pathname;
      let template;
      let render;

      if (!isProd) {
        template = await fs.readFile(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(pathname, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        template = await fs.readFile(path.resolve(__dirname, "dist/client/index.html"), "utf-8");
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const { appHtml, initialData } = await render(pathname, { apiBase });
      const initialDataScript = `<script>window.__INITIAL_DATA__=${JSON.stringify(initialData).replace(/</g, "\\u003c")}</script>`;
      const html = template
        .replace("<!--ssr-outlet-->", appHtml)
        .replace("<!--initial-data-->", initialDataScript);

      const statusCode = initialData.route.name === "not-found" ? 404 : 200;
      res.status(statusCode).set({ "Content-Type": "text/html" }).end(html);
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
