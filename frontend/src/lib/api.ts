/**
 * SAGZFX ACADEMY - API client
 * Typed wrapper around the FastAPI backend.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// ─── Auth storage ──────────────────────────────────────────

const TOKEN_KEY = "sagzfx_access_token";
const REFRESH_KEY = "sagzfx_refresh_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, access);
  window.localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

// ─── Fetch wrapper ─────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(status: number, detail: unknown, message?: string) {
    super(message ?? `API error ${status}`);
    this.status = status;
    this.detail = detail;
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  auth?: boolean;   // attach Bearer token
  form?: boolean;   // send as application/x-www-form-urlencoded
};

export async function api<T = unknown>(
  path: string,
  opts: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true, form = false } = opts;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  let payload: BodyInit | undefined;

  if (body !== undefined) {
    if (form) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
        params.append(k, String(v));
      }
      payload = params.toString();
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const res = await fetch(url, {
    method,
    headers,
    body: payload,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    const detail =
      typeof data === "object" && data !== null && "detail" in data
        ? (data as { detail: unknown }).detail
        : data;
    throw new ApiError(res.status, detail);
  }

  return data as T;
}

// ─── Domain types ──────────────────────────────────────────

export type User = {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  has_paid_tuition: boolean;
  learning_plan: "registered" | "beginner" | "advanced" | "masters";
  class_started_at: string | null;
  class_expires_at: string | null;
  mentorship_lifetime: boolean;
  exness_demo_account_number: string | null;
  created_at: string;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type ModuleSummary = {
  module_id: string;
  tier_level: string;
  title: string;
  sort_order: number;
  is_premium_locked: boolean;
  unlocked: boolean;
};

export type CatalogResponse = {
  access_tier: "registered" | "beginner" | "advanced" | "masters";
  total: number;
  unlocked_count: number;
  modules: ModuleSummary[];
};

export type BrandInfo = {
  name: string;
  rc: string;
  slogan: string;
  campus: string;
  social: string;
  phones: string[];
  exness_ib_link: string;
};

// ─── Endpoint helpers ──────────────────────────────────────

export const endpoints = {
  brand: () => api<BrandInfo>("/api/v1/brand", { auth: false }),

  register: (full_name: string, email: string, password: string) =>
    api<User>("/api/v1/auth/register", {
      method: "POST",
      body: { full_name, email, password },
      auth: false,
    }),

  login: (email: string, password: string) =>
    api<TokenPair>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),

  me: () => api<User>("/api/v1/auth/me"),

  catalog: () => api<CatalogResponse>("/api/v1/curriculum/modules"),

  module: (module_id: string) => api<ModuleSummary & { video_url_slug: string | null }>(`/api/v1/curriculum/modules/${module_id}`),

  mt5Status: () => api<{ bound: boolean; login: string | null; server: string | null; exness_ib_link: string }>("/api/v1/mt5-demo/status"),

  provisionMt5: () =>
    api<{ login: string; password: string; investor_password: string; server: string; exness_ib_link: string; created_at: string }>(
      "/api/v1/mt5-demo/provision",
      { method: "POST" },
    ),

  realtimeConfig: () =>
    api<{ supabase_url: string | null; supabase_anon_key: string | null; channel: string; access_tier: string }>(
      "/api/v1/community/realtime-config",
    ),

  initPayment: (product_slug: string, callback_url: string) =>
    api<{ provider: string; checkout_url: string; reference: string }>(
      "/api/v1/payments/init",
      { method: "POST", body: { product_slug, callback_url } },
    ),
};
