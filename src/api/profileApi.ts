import { fetchJson } from "./http";
import type { ApiRequestOptions, Profile } from "../types";

export function fetchProfile(options?: ApiRequestOptions): Promise<Profile> {
  return fetchJson<Profile>("/api/profile", options);
}
