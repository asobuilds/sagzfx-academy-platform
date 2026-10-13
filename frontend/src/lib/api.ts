/**
 * SAGZFX ACADEMY - API client.
 *
 * Auth model: cookie-only.
 *   - The backend sets HttpOnly cookies named `sagzfx_access` and `sagzfx_refresh`.
 *   - Every request sends `credentials: "include"` so cookies travel with them.
 *   - The frontend NEVER stores tokens in localStorage.
 *   - To know if the user is logged in, call `me()`. A 200 means yes, a 401 means no.
 */

// The fallback must be `localhost`, NOT `127.0.0.1`: the session cookie is
// SameSite=Lax, and browsers ignore the port when computing "same site". A
// page on localhost:3000 calling localhost:8000 is same-site (cookie sent);
// calling 127.0.0.1:8000 is cross-site (cookie dropped -> 401 on /auth/me).
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Deprecated token helpers (kept for compatibility) ─────

export function getToken(): string | null {
  return null;
}

export function clearTokens(): void {
  // no-op — cookies are cleared by the backend on logout
}

export function setTokens(_access: string, _refresh: string): void {
  // no-op
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
  auth?: boolean;
  form?: boolean;
};

export async function api<T = unknown>(
  path: string,
  opts: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, form = false } = opts;

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

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const res = await fetch(url, {
    method,
    headers,
    body: payload,
    credentials: "include", // ← cookies travel with every request
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
  learning_plan?: string;
  class_expires_at?: string | null;
  mentorship_lifetime?: boolean;
  exness_demo_account_number: string | null;
  created_at: string;
};

export type ModuleSummary = {
  module_id: string;
  tier_level: string;
  title: string;
  sort_order: number;
  is_premium_locked: boolean;
  unlocked: boolean;
};

export type ModuleDetail = ModuleSummary & {
  video_url_slug: string | null;
  lesson_body: string | null;
  learning_outcomes: string[];
  assignment: string | null;
  checkpoint_questions: {
    prompt: string;
    options: string[];
    correct_index: number;
    explanation: string;
  } | null;
  estimated_minutes: number | null;
  lesson_status: string | null;
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

export type PracticeAccount = {
  account_id: string;
  starting_balance: string;
  balance: string;
  currency: string;
  status: string;
  reset_count: number;
  execution_enabled: boolean;
};

export type PracticeOrder = {
  order_id: string;
  symbol: string;
  side: "buy" | "sell";
  lot_size: string;
  entry_price: string;
  opened_at: string;
  status: string;
};

export type LedgerEntry = {
  entry_id: string;
  kind: string;
  amount: string;
  balance_after: string;
  created_at: string;
  note: string | null;
};

export type PublicReview = {
  review_id: string;
  full_name: string;
  rating: number;
  body: string;
};

// ─── Endpoint helpers ──────────────────────────────────────

export const endpoints = {
  // ─── Public / brand ──────────────────────────────────────

  brand: () => api<BrandInfo>("/api/v1/brand", { auth: false }),

  // ─── Auth ────────────────────────────────────────────────

  register: (full_name: string, email: string, password: string) =>
    api<User>("/api/v1/auth/register", {
      method: "POST",
      body: { full_name, email, password },
      auth: false,
    }),

  login: (email: string, password: string) =>
    api<{ authenticated: boolean }>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),

  logout: () => api<void>("/api/v1/auth/logout", { method: "POST" }),

  me: () => api<User>("/api/v1/auth/me"),

  // ─── Curriculum ──────────────────────────────────────────

  catalog: () => api<CatalogResponse>("/api/v1/curriculum/modules"),

  module: (module_id: string) =>
    api<ModuleDetail>(`/api/v1/curriculum/modules/${module_id}`),

  // ─── MT5 / Exness ────────────────────────────────────────

  mt5Status: () =>
    api<{
      bound: boolean;
      login: string | null;
      server: string | null;
      exness_ib_link: string;
    }>("/api/v1/mt5-demo/status"),

  // ─── Community realtime ──────────────────────────────────

  realtimeConfig: () =>
    api<{
      supabase_url: string | null;
      supabase_anon_key: string | null;
      channel: string;
      access_tier: string;
    }>("/api/v1/community/realtime-config"),

  // ─── Payments ────────────────────────────────────────────

  initPayment: (product_slug: string, callback_url: string) =>
    api<{ provider: string; checkout_url: string; reference: string }>(
      "/api/v1/payments/init",
      { method: "POST", body: { product_slug, callback_url } },
    ),

  // ─── Practice Trading ────────────────────────────────────

  practiceAccount: () =>
    api<PracticeAccount | null>("/api/v1/practice-trading/account"),

  createPracticeAccount: () =>
    api<PracticeAccount>("/api/v1/practice-trading/account", {
      method: "POST",
    }),

  resetPracticeAccount: () =>
    api("/api/v1/practice-trading/account/reset", { method: "POST" }),

  practiceOrders: () =>
    api<PracticeOrder[]>("/api/v1/practice-trading/orders"),

  openPracticeOrder: (symbol: string, side: "buy" | "sell", lot_size: number) =>
    api<PracticeOrder>("/api/v1/practice-trading/orders", {
      method: "POST",
      body: { symbol, side, lot_size },
    }),

  closePracticeOrder: (order_id: string) =>
    api(`/api/v1/practice-trading/orders/${order_id}/close`, {
      method: "POST",
    }),

  practiceLedger: () =>
    api<LedgerEntry[]>("/api/v1/practice-trading/ledger"),

  practiceQuote: (symbol: string) =>
    api<{ symbol: string; bid: string; ask: string; ts: string }>(
      `/api/v1/practice-trading/quote/${symbol}`,
    ),

  practiceHistory: (symbol: string) =>
    api<Array<{ ts: string; price: string }>>(
      `/api/v1/practice-trading/history/${symbol}`,
    ),

  // ─── Community Voice ─────────────────────────────────────

  publicReviews: () =>
    api<PublicReview[]>("/api/v1/feedback/reviews", { auth: false }),

  submitReview: (rating: number, body: string) =>
    api("/api/v1/feedback/reviews", {
      method: "POST",
      body: { rating, body },
    }),

  submitFeedback: (message: string) =>
    api("/api/v1/feedback", { method: "POST", body: { message } }),
};
