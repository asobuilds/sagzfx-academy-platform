# AUTH + FRONTEND FULL DIAGNOSIS AND FIX
## SAGZFX ACADEMY

ROLE: You are the Auth Repair Agent. Fix the login/redirect/network issues
once and for all. You will diagnose from evidence, then fix.

MISSION (STRICT, TWO-PHASE):

  PHASE 1 — DIAGNOSE (read-only, no edits). Report findings as a numbered
  list of root causes with file:line references.

  PHASE 2 — FIX (only after Phase 1 report). Apply minimal fixes. Verify
  with curl. Report every file changed.

CURRENT SYMPTOMS (from the operator's browser console):

  1. Login succeeds in the UI but the dashboard loads and shows
     "Failed to load dashboard. Is the backend running?"
  2. Console shows:
       GET /api/v1/auth/me 401 Unauthorized
       GET /api/v1/curriculum/modules ERR_NETWORK_CHANGED
       GET /api/v1/community/realtime-config ERR_NETWORK_CHANGED
       GET /api/v1/mt5-demo/status ERR_NETWORK_CHANGED
  3. This alternates: sometimes 401, sometimes ERR_NETWORK_CHANGED.
  4. The operator reported that /api/v1/mt5-demo/status 404s intermittently
     but the route is confirmed present in app/main.py.

CONTEXT:
  - Backend: FastAPI on http://127.0.0.1:8000, cookie auth
  - Frontend: Next.js on http://localhost:3000
  - Cookie settings: HttpOnly, secure from env (COOKIE_SECURE), samesite=None
  - Auth model: cookie-only. Frontend never reads tokens from localStorage.
  - `me()` is the source of truth for auth state.

PHASE 1 — DIAGNOSE (read-only, no edits):

  STEP 1 — Read these files fully and report contents:
    - app/api/v1/auth.py
    - app/main.py
    - app/core/config.py
    - frontend/src/lib/api.ts
    - frontend/src/app/login/page.tsx
    - frontend/src/app/dashboard/page.tsx
    - frontend/src/components/Navbar.tsx

  STEP 2 — Report the current CORS and cookie configuration. Run:
      grep -n "allow_origins\|allow_credentials\|CORSMiddleware" app/main.py
      grep -n "COOKIE_SECURE\|secure\|samesite\|httponly" app/api/v1/auth.py app/core/config.py
      grep -n "^CORS_ORIGINS\|^COOKIE_SECURE" .env
      grep -n "NEXT_PUBLIC_API_URL" frontend/.env.local 2>/dev/null || echo "no frontend .env.local"

  STEP 3 — Test the login + cookie + me flow with curl. Run EXACTLY:
      curl -i -s -c /tmp/sagzfx_c.txt \
        -X POST http://127.0.0.1:8000/api/v1/auth/login \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:3000" \
        -d '{"email":"test1@sagzfx.dev","password":"testpass1234"}'

      curl -i -s -b /tmp/sagzfx_c.txt \
        -H "Origin: http://localhost:3000" \
        http://127.0.0.1:8000/api/v1/auth/me

    Report:
      - Exact HTTP status codes
      - Exact Set-Cookie header values (names, Secure, SameSite, HttpOnly, Path, Domain)
      - Whether the second request succeeds (should be 200 if cookies work)

  STEP 4 — Test the failing endpoints from the browser's perspective. Run:
      curl -i -s -b /tmp/sagzfx_c.txt \
        -H "Origin: http://localhost:3000" \
        http://127.0.0.1:8000/api/v1/curriculum/modules
      curl -i -s -b /tmp/sagzfx_c.txt \
        -H "Origin: http://localhost:3000" \
        http://127.0.0.1:8000/api/v1/community/realtime-config
      curl -i -s -b /tmp/sagzfx_c.txt \
        -H "Origin: http://localhost:3000" \
        http://127.0.0.1:8000/api/v1/mt5-demo/status

    Report status codes and full response bodies for each.

  STEP 5 — Diagnose the ERR_NETWORK_CHANGED errors. That error comes from
    Chrome when a request fails at the network layer, often because:
      (a) CORS preflight is being rejected
      (b) The server response is missing the CORS headers the browser expects
      (c) The frontend is hitting an HTTPS URL when the backend is HTTP (or vice versa)
      (d) The request is being cancelled because of a credentials/Origin mismatch

    Test the preflight explicitly:
      curl -i -s -X OPTIONS http://127.0.0.1:8000/api/v1/auth/me \
        -H "Origin: http://localhost:3000" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: content-type"

    Report the full response headers.

  STEP 6 — Produce a numbered list of ROOT CAUSES. For each cause:
      - Symptom it explains (401 / ERR_NETWORK_CHANGED / 404 / redirect loop)
      - The exact file:line that causes it
      - The minimal fix

  DO NOT EDIT ANY FILE IN PHASE 1. Report only.

PHASE 2 — FIX (only after Phase 1 is complete):

  For each root cause identified in Phase 1:
    - Apply the minimum change required
    - Do NOT rewrite files. Do NOT restructure. Do NOT refactor.
    - Do NOT delete anything unless it is the direct cause of a bug.
    - Do NOT touch frontend/content/ or any files in the migrations/ folder.
    - Do NOT touch app/models/ or app/schemas/ unless required by a root cause.

  Common fixes that may apply:
    - Cookie SameSite=None + Secure=true is rejected by browsers over plain
      HTTP. For local development, Secure must be false. Confirm
      COOKIE_SECURE=false is honored in auth.py.
    - CORS with allow_credentials=True cannot use wildcard origins. Ensure
      allow_origins is an explicit list and includes http://localhost:3000.
    - The CSRF middleware in app/main.py must allow Origin=http://localhost:3000.
    - If the frontend's NEXT_PUBLIC_API_URL has a trailing slash or a wrong
      host, fix it in frontend/.env.local.

  VERIFY after fixes. Run:
      curl -i -s -c /tmp/sagzfx_c2.txt \
        -X POST http://127.0.0.1:8000/api/v1/auth/login \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:3000" \
        -d '{"email":"test1@sagzfx.dev","password":"testpass1234"}'
      curl -i -s -b /tmp/sagzfx_c2.txt \
        -H "Origin: http://localhost:3000" \
        http://127.0.0.1:8000/api/v1/auth/me
      curl -i -s -b /tmp/sagzfx_c2.txt \
        -H "Origin: http://localhost:3000" \
        http://127.0.0.1:8000/api/v1/curriculum/modules

    All three must return 200. Paste the outputs.

HARD CONSTRAINTS:
  - PHASE 1 IS READ-ONLY. No exceptions.
  - Do NOT run git commit, git push, git checkout, git reset, or git clean.
  - Do NOT delete any file.
  - Do NOT touch anything in frontend/content/.
  - Do NOT touch the migrations/ folder.
  - Do NOT rewrite whole files. Minimal diffs only.
  - After Phase 2, tell the operator to restart uvicorn (do not do it yourself).

WHEN DONE:
  1. Print the numbered list of root causes from Phase 1.
  2. Print the exact diff (or a description of changes) for each file edited.
  3. Print the final verification curl outputs.
  4. Tell the operator what to do next (restart uvicorn, hard-refresh browser).
  5. Explicitly state if any file was NOT changed because it was already correct.

