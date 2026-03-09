import { loadHomePageData } from "./homePageLoader";
import { loadPostPageData } from "./postPageLoader";
import { matchRoute } from "../routes/routeMatcher";
import type { ApiRequestOptions, InitialDataEnvelope } from "../types";

export async function loadPageData(pathname: string, options?: ApiRequestOptions): Promise<InitialDataEnvelope> {
  const route = matchRoute(pathname);

  if (route.name === "home") {
    return {
      route,
      data: await loadHomePageData(options)
    };
  }

  if (route.name === "post") {
    return {
      route,
      data: await loadPostPageData({ postId: route.params.postId, ...options })
    };
  }

  return { route, data: null };
}
