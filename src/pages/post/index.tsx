import { useEffect, useState } from "react";
import PostReactionsCsr from "../../components/PostReactionsCsr";
import { useInitialData } from "../../initialDataContext";
import type { InitialDataEnvelope, PostPageData } from "../../types";
import { loadPostPageData } from "./loader";

function pickInitialPostData(initialData: InitialDataEnvelope | null, postId: string): PostPageData | null {
  if (initialData?.route?.name !== "post") return null;
  if (initialData?.route?.params?.postId !== postId) return null;
  return initialData.data as PostPageData;
}

export default function PostPage() {
  const initialData = useInitialData();
  const postId =
    initialData?.route?.name === "post"
      ? initialData.route.params.postId
      : typeof window !== "undefined"
        ? window.location.pathname.split("/").pop() ?? ""
        : "";
  const [data, setData] = useState<PostPageData | null>(() => pickInitialPostData(initialData, postId));

  useEffect(() => {
    if (data) return;
    let cancelled = false;

    loadPostPageData({ postId })
      .then((next) => {
        if (!cancelled) setData(next);
      })
      .catch(() => {
        if (!cancelled) {
          setData({ post: { id: postId, title: "-", body: "-" }, comments: [] });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [data, postId]);

  const post = data?.post ?? { id: postId, title: "-", body: "-" };
  const comments = data?.comments ?? [];

  return (
    <>
      <h1>Dynamic Route: /posts/{post.id}</h1>
      <p>
        <a href="/">홈으로</a>
      </p>
      <h2>SSR Section</h2>
      <article>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </article>
      <h3>SSR Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.author}:</strong> {comment.text}
          </li>
        ))}
      </ul>
      <hr />
      <h2>CSR Section</h2>
      <PostReactionsCsr postId={post.id} />
    </>
  );
}
