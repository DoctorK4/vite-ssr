import { fetchNotices } from "../api/noticesApi";
import type { ApiRequestOptions, Notice } from "../types";

export async function loadNotices(options?: ApiRequestOptions): Promise<Notice[]> {
  return fetchNotices(options);
}
