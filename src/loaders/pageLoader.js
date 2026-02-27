import { loadHomePageData } from "./homePageLoader";
import { loadPostPageData } from "./postPageLoader";
import { matchRoute } from "../routes/routeMatcher";

export async function loadPageData(pathname, options) {
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
