import { createFileRoute } from "@tanstack/react-router";
import { PostPage } from "../pages/post";
import type { InitialDataEnvelope, InitialDataResolver, PostPageData } from "../types";
import { loadPostPageData } from "../pages/post/loader";

// SSR: Server-side data loading
export const resolveInitialData: InitialDataResolver = async (pathname, context) => {
  const match = pathname.match(/^\/posts\/([^/]+)$/);
  if (!match) return null;

  const route: InitialDataEnvelope["route"] = {
    name: "post",
    params: { postId: match[1] }
  };
  const data = await loadPostPageData({
    postId: route.params.postId,
    apiBase: context.apiBase,
    fetchImpl: context.fetchImpl
  });

  return { route, data };
};

// CSR: Client-side route loader
export const Route = createFileRoute("/posts/$postId")(
  {
    loader: async ({ params }) => {
      try {
        return await loadPostPageData({ postId: params.postId });
      } catch {
        return {
          post: { id: params.postId, title: "-", body: "-" },
          comments: []
        } as PostPageData;
      }
    },
    component: PostPage
  }
);
