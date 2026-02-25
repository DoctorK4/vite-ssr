export async function fetchJson(endpoint, { apiBase = "", fetchImpl = fetch } = {}) {
  const url = apiBase ? `${apiBase}${endpoint}` : endpoint;
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }

  return response.json();
}
