import { fetchNotices } from "../api/noticesApi";

export async function loadNotices(options) {
  return fetchNotices(options);
}
