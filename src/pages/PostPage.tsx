import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PostReactionsCsr from "../components/PostReactionsCsr";
import { useInitialData } from "../initialDataContext";
import { loadPostPageData } from "../loaders/postPageLoader";
import type { InitialDataEnvelope, PostPageData } from "../types";

function pickInitialPostData(initialData: InitialDataEnvelope | null, postId: string): PostPageData | null {
  if (initialData?.route?.name !== "post") return null;
  if (initialData?.route?.params?.postId !== postId) return null;
  return initialData.data as PostPageData;
}

export default function PostPage() {
  const { postId } = useParams({ from: "/posts/$postId" });
  const initialData = useInitialData();
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
        <Link to="/">홈으로</Link>
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
