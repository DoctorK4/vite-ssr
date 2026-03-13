import { useParams } from "@tanstack/react-router";
import { useInitialData } from "../../initialDataContext";
import type { PostPageData } from "../../types";
import PostReactionsCsr from "../../components/PostReactionsCsr";

export function PostPage() {
  const { postId } = useParams({ from: "/posts/$postId" });

  const initialData = useInitialData();
  const data = initialData?.route.name === "post" && initialData.route.params.postId === postId
    ? (initialData.data as PostPageData)
    : {
        post: { id: postId, title: "-", body: "-" },
        comments: []
      };

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
