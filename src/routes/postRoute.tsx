import { createRoute } from "@tanstack/react-router";
import PostPage from "../pages/post";
import { loadPostPageData } from "../pages/post/loader";
import type { InitialDataEnvelope, PostPageData, PostRoute, RouteLoaderContext } from "../types";

export const postRouteInfo = {
  name: "post" as const,
  path: "/posts/$postId",
  match(pathname: string): PostRoute | null {
    const match = pathname.match(/^\/posts\/([^/]+)$/);
    return match ? { name: "post", params: { postId: match[1] } } : null;
  },
  async load(context: RouteLoaderContext & { params: { postId: string } }): Promise<PostPageData> {
    return loadPostPageData({ postId: context.params.postId, apiBase: context.apiBase, fetchImpl: context.fetchImpl });
  },
  async resolve(pathname: string, context: Omit<RouteLoaderContext, "pathname">): Promise<InitialDataEnvelope | null> {
    const route = postRouteInfo.match(pathname);
    if (!route) return null;

    const data = await postRouteInfo.load({ ...context, pathname, params: route.params });
    return { route, data };
  }
};

export function createPostRoute(rootRoute: any) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: postRouteInfo.path,
    component: PostPage
  });
}
