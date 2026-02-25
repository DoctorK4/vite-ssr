import { fetchProfile } from "../api/profileApi";

export async function loadProfile(options) {
  return fetchProfile(options);
}
