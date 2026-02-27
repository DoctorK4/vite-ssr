import { fetchPost } from "../api/postApi";
import { fetchPostComments } from "../api/postCommentsApi";

export async function loadPostPageData({ postId, ...options }) {
  const [post, comments] = await Promise.all([
    fetchPost(postId, options),
    fetchPostComments(postId, options)
  ]);

  return { post, comments };
}
