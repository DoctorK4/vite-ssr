import { renderToString } from "react-dom/server";
import App from "./App";
import { loadPageData } from "./loaders/pageLoader";

export async function render(url, { apiBase }) {
  const initialData = await loadPageData(url, { apiBase });
  const appHtml = renderToString(<App route={initialData.route} data={initialData.data} />);
  return { appHtml, initialData };
}
