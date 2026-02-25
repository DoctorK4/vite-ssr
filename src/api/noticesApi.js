import { fetchJson } from "./http";

export function fetchNotices(options) {
  return fetchJson("/api/notices", options);
}
