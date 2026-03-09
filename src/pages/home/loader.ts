import { loadNotices } from "../../loaders/noticesLoader";
import { loadProfile } from "../../loaders/profileLoader";
import { loadStats } from "../../loaders/statsLoader";
import type { ApiRequestOptions, HomePageData } from "../../types";

export async function loadHomePageData(options?: ApiRequestOptions): Promise<HomePageData> {
  const [profile, notices, stats] = await Promise.all([
    loadProfile(options),
    loadNotices(options),
    loadStats(options)
  ]);

  return { profile, notices, stats };
}
