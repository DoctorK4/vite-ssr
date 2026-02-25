import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { loadHomePageData } from "./loaders/homePageLoader";

async function bootstrap() {
  const initialData = window.__INITIAL_DATA__ ?? (await loadHomePageData());
  hydrateRoot(document.getElementById("root"), <App data={initialData} />);
}

bootstrap();
