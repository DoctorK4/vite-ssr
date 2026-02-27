import { fetchJson } from "./http";

export function fetchPostComments(postId, options) {
  return fetchJson(`/api/posts/${postId}/comments`, options);
}
