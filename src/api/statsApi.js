import { fetchJson } from "./http";

export function fetchStats(options) {
  return fetchJson("/api/stats", options);
}
