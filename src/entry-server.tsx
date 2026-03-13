import { renderToString } from "react-dom/server";
import { RouterProvider } from "@tanstack/react-router";
import { InitialDataProvider } from "./initialDataContext";
import { createAppRouter } from "./router";
import type { InitialDataEnvelope } from "./types";
import { loadInitialData } from "./routes/manifest";

interface RenderOptions {
  apiBase: string;
}

export async function render(url: string, { apiBase }: RenderOptions): Promise<{ appHtml: string; initialData: InitialDataEnvelope }> {
  // Load initial data using manifest
  const initialData = await loadInitialData(url, { apiBase });

  // Create router and render
  const router = createAppRouter({ url, isServer: true });
  await router.load();

  const appHtml = renderToString(
    <InitialDataProvider initialData={initialData}>
      <RouterProvider router={router} />
    </InitialDataProvider>
  );

  return { appHtml, initialData };
}
