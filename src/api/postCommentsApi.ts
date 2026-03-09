import { fetchJson } from "./http";
import type { ApiRequestOptions, PostComment } from "../types";

export function fetchPostComments(postId: string, options?: ApiRequestOptions): Promise<PostComment[]> {
  return fetchJson<PostComment[]>(`/api/posts/${postId}/comments`, options);
}
