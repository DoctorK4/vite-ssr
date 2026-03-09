import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { InitialDataProvider } from "./initialDataContext";
import { loadPageData } from "./loaders/pageLoader";
import { createAppRouter } from "./router";

async function bootstrap() {
  const pathname = window.location.pathname;
  const initialData = window.__INITIAL_DATA__ ?? (await loadPageData(pathname));
  const router = createAppRouter({ isServer: false });
  await router.load();
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element #root not found");
  }

  hydrateRoot(
    rootElement,
    <InitialDataProvider initialData={initialData}>
      <RouterProvider router={router} />
    </InitialDataProvider>
  );
}

bootstrap();
