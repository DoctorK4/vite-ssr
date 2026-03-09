import { fetchJson } from "./http";
import type { ApiRequestOptions, Post } from "../types";

export function fetchPost(postId: string, options?: ApiRequestOptions): Promise<Post> {
  return fetchJson<Post>(`/api/posts/${postId}`, options);
}
