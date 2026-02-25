import { fetchStats } from "../api/statsApi";

export async function loadStats(options) {
  return fetchStats(options);
}
