import { fetchJson } from "./http";

export function fetchProfile(options) {
  return fetchJson("/api/profile", options);
}
