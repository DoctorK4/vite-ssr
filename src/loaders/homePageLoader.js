import { loadNotices } from "./noticesLoader";
import { loadProfile } from "./profileLoader";
import { loadStats } from "./statsLoader";

export async function loadHomePageData(options) {
  const [profile, notices, stats] = await Promise.all([
    loadProfile(options),
    loadNotices(options),
    loadStats(options)
  ]);

  return { profile, notices, stats };
}
