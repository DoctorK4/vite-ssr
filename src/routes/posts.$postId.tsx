import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import PostReactionsCsr from "../components/PostReactionsCsr";
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
    component: PostRouteComponent
  }
);

function PostRouteComponent() {
  const data = useLoaderData({ from: "/posts/$postId" });
  const { postId } = useParams({ from: "/posts/$postId" });

  return (
    <>
      <h1>Dynamic Route: /posts/{postId}</h1>
      <p>
        <a href="/">홈으로</a>
      </p>
      <h2>SSR Section</h2>
      <article>
        <h3>{data.post.title}</h3>
        <p>{data.post.body}</p>
      </article>
      <h3>SSR Comments</h3>
      <ul>
        {data.comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.author}:</strong> {comment.text}
          </li>
        ))}
      </ul>
      <hr />
      <h2>CSR Section</h2>
      <PostReactionsCsr postId={postId} />
    </>
  );
}
