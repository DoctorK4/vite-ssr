import { fetchJson } from "./http";
import type { ApiRequestOptions, Notice } from "../types";

export function fetchNotices(options?: ApiRequestOptions): Promise<Notice[]> {
  return fetchJson<Notice[]>("/api/notices", options);
}
