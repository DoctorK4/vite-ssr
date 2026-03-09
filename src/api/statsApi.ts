import { fetchJson } from "./http";
import type { ApiRequestOptions, Stats } from "../types";

export function fetchStats(options?: ApiRequestOptions): Promise<Stats> {
  return fetchJson<Stats>("/api/stats", options);
}
