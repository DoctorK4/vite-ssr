import type { ApiRequestOptions } from "../types";

export async function fetchJson<T>(endpoint: string, { apiBase = "", fetchImpl = fetch }: ApiRequestOptions = {}): Promise<T> {
  const url = apiBase ? `${apiBase}${endpoint}` : endpoint;
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }

  return response.json() as Promise<T>;
}
