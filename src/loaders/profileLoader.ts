import { fetchProfile } from "../api/profileApi";
import type { ApiRequestOptions, Profile } from "../types";

export async function loadProfile(options?: ApiRequestOptions): Promise<Profile> {
  return fetchProfile(options);
}
