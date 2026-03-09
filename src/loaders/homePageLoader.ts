import { loadNotices } from "./noticesLoader";
import { loadProfile } from "./profileLoader";
import { loadStats } from "./statsLoader";
import type { ApiRequestOptions, HomePageData } from "../types";

export async function loadHomePageData(options?: ApiRequestOptions): Promise<HomePageData> {
  const [profile, notices, stats] = await Promise.all([
    loadProfile(options),
    loadNotices(options),
    loadStats(options)
  ]);

  return { profile, notices, stats };
}
