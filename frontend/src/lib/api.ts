/**
 * SAGZFX ACADEMY - API client.
 *
 * Auth model: cookie-only.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Deprecated token helpers ──────────────────────────────

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
    credentials: "include",
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

// ─── Practice Trading types ────────────────────────────────
// These mirror the response shapes from app/api/v1/practice_trading.py
// and app/schemas/practice_trading.py

export type PracticeAccount = {
  account_id: string;
  user_id: string;
  starting_balance: string;
  balance: string;
  currency: string;
  status: string;
  reset_count: number;
  execution_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type PracticeOrder = {
  order_id: string;
  account_id: string;
  symbol: string;
  side: "buy" | "sell";
  lot_size: string;
  entry_price: string;
  entry_rate_date: string | null;
  status: "open" | "closed";
  exit_price: string | null;
  realized_pnl: string | null;
  opened_at: string;
  closed_at: string | null;
};

export type PracticeLedgerEntry = {
  entry_id: string;
  account_id: string;
  entry_type: string;
  amount: string;
  balance_after: string;
  note: string | null;
  created_at: string;
};

export type PracticeQuote = {
  symbol: string;
  rate: string;
  rate_date: string;
  provider: string;
  price_type: string;
  realtime: boolean;
  execution_enabled: boolean;
  disclaimer: string;
};

export type PracticeHistoryPoint = {
  date: string;
  rate: number;
};

export type PublicReview = {
  review_id: string;
  full_name: string;
  rating: number;
  body: string;
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
    api<{ authenticated: boolean }>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),

  logout: () => api<void>("/api/v1/auth/logout", { method: "POST" }),

  me: () => api<User>("/api/v1/auth/me"),

  catalog: () => api<CatalogResponse>("/api/v1/curriculum/modules"),

  module: (module_id: string) =>
    api<ModuleDetail>(`/api/v1/curriculum/modules/${module_id}`),

  mt5Status: () =>
    api<{
      bound: boolean;
      login: string | null;
      server: string | null;
      exness_ib_link: string;
    }>("/api/v1/mt5-demo/status"),

  realtimeConfig: () =>
    api<{
      supabase_url: string | null;
      supabase_anon_key: string | null;
      channel: string;
      access_tier: string;
    }>("/api/v1/community/realtime-config"),

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
    api<PracticeAccount>("/api/v1/practice-trading/account/reset", {
      method: "POST",
    }),

  practiceOrders: () =>
    api<PracticeOrder[]>("/api/v1/practice-trading/orders"),

  openPracticeOrder: (symbol: string, side: "buy" | "sell", lot_size: number) =>
    api<PracticeOrder>("/api/v1/practice-trading/orders", {
      method: "POST",
      body: { symbol, side, lot_size },
    }),

  closePracticeOrder: (order_id: string) =>
    api<PracticeOrder>(`/api/v1/practice-trading/orders/${order_id}/close`, {
      method: "POST",
    }),

  practiceLedger: () =>
    api<PracticeLedgerEntry[]>("/api/v1/practice-trading/ledger"),

  practiceQuote: (symbol: string) =>
    api<PracticeQuote>(`/api/v1/practice-trading/quote/${symbol}`),

  practiceHistory: (symbol: string) =>
    api<PracticeHistoryPoint[]>(
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