import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { loadPageData } from "./loaders/pageLoader";

async function bootstrap() {
  const pathname = window.location.pathname;
  const initialData = window.__INITIAL_DATA__ ?? (await loadPageData(pathname));

  hydrateRoot(document.getElementById("root"), <App route={initialData.route} data={initialData.data} />);
}

bootstrap();
