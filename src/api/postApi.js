import { fetchJson } from "./http";

export function fetchPost(postId, options) {
  return fetchJson(`/api/posts/${postId}`, options);
}
