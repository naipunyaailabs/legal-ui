const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}

export const getDashboardStats = () => apiFetch("/dashboard/stats");

export const getCases = (params: Record<string, string | number>) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  return apiFetch(`/cases?${qs.toString()}`);
};

export const getCase = (id: number) => apiFetch(`/cases/${id}`);
export const getFilterOptions = () => apiFetch("/cases/filters/options");

export const searchCases = (body: object) =>
  apiFetch("/search", { method: "POST", body: JSON.stringify(body) });

export const askAI = (body: object) =>
  apiFetch("/ai/answer", { method: "POST", body: JSON.stringify(body) });

export const summarizeCase = (case_id: number) =>
  apiFetch("/ai/summarize", { method: "POST", body: JSON.stringify({ case_id }) });

export const generateDraft = (body: object) =>
  apiFetch("/drafts/generate", { method: "POST", body: JSON.stringify(body) });

export const runIngestion = (file_pattern?: string) =>
  apiFetch("/ingestion/run", {
    method: "POST",
    body: JSON.stringify({ file_pattern: file_pattern || null }),
  });
