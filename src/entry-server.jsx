import { renderToString } from "react-dom/server";
import App from "./App";
import { loadHomePageData } from "./loaders/homePageLoader";

export async function render(_, { apiBase }) {
  const data = await loadHomePageData({ apiBase });
  const appHtml = renderToString(<App data={data} />);
  return { appHtml, initialData: data };
}
