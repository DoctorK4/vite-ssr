import { fetchStats } from "../api/statsApi";
import type { ApiRequestOptions, Stats } from "../types";

export async function loadStats(options?: ApiRequestOptions): Promise<Stats> {
  return fetchStats(options);
}
