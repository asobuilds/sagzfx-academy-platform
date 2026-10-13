# AUTH DIAGNOSIS AND FIX MISSION
## SAGZFX ACADEMY — Login redirect loop

ROLE: You are the Auth Agent. You will diagnose and fix a login redirect loop.

MISSION (STRICT, TWO-PHASE):

  PHASE 1 — RECON (read-only, no edits)
    Gather evidence. Do NOT edit any file. Report findings.

  PHASE 2 — FIX (only after Phase 1 report)
    Fix the minimum set of files required. Report the exact diff.

CONTEXT:
  - Backend: FastAPI on http://127.0.0.1:8000 (running)
  - Frontend: Next.js on http://localhost:3000 (running)
  - Symptom: user logs in, is redirected to /dashboard, but the page bounces
    back to /login. Navbar sometimes shows "Login" even after successful login.
  - Auth design: the backend sets HttpOnly cookies (sagzfx_access, sagzfx_refresh).
    Frontend should NOT rely on localStorage. `me()` is the source of truth.

PHASE 1 — RECON TASKS (do these first, report only, do NOT edit):

  1. Read these files IN FULL and report their contents:
       - backend:  app/api/v1/auth.py
       - backend:  app/api/main.py (for CORS + cookies middleware)
       - backend:  app/core/security.py
       - frontend: src/lib/api.ts
       - frontend: src/app/login/page.tsx
       - frontend: src/components/Navbar.tsx
       - frontend: src/app/dashboard/page.tsx

  2. Test the login + cookie flow with curl. Run EXACTLY these commands and
     paste the raw output:

       curl -i -s -X POST http://127.0.0.1:8000/api/v1/auth/login \
         -H "Content-Type: application/json" \
         -d '{"email":"test1@sagzfx.dev","password":"testpass1234"}'

     (This shows the response headers including Set-Cookie.)

     Then repeat using the cookie jar:
       curl -i -s -c /tmp/sagzfx_cookies.txt -X POST http://127.0.0.1:8000/api/v1/auth/login \
         -H "Content-Type: application/json" \
         -d '{"email":"test1@sagzfx.dev","password":"testpass1234"}'
       curl -i -s -b /tmp/sagzfx_cookies.txt http://127.0.0.1:8000/api/v1/auth/me

     Report the exact status codes and Set-Cookie values.

  3. Report the current CORS configuration:
       grep -n "allow_origins\|CORSMiddleware\|CORS_ORIGINS" app/main.py
       grep -n "^CORS_ORIGINS" .env

  4. Report whether cookies are marked Secure (which blocks http://localhost):
       grep -n "secure\|samesite\|httponly" app/api/v1/auth.py

  5. Diagnose the root cause. Common failure modes:
       (a) Cookie has secure=True but frontend is http://localhost → browser
           silently drops the cookie → next request is 401 → redirect loop.
       (b) CORS allow_origins doesn't include http://localhost:3000 → browser
           blocks the response and drops Set-Cookie.
       (c) Frontend login() calls me() immediately before the cookie is
           committed → race condition.
       (d) Cookie path or domain wrong → cookie is set but never sent back.
       (e) Login page never waited for a successful me() before redirecting.

PHASE 2 — FIX (only after Phase 1 report):

  Fix the smallest set of files that makes login work end-to-end.

  Constraints:
    - Preserve HttpOnly cookie architecture. Do NOT revert to localStorage.
    - If cookies have secure=True and the developer is on http://localhost,
      make secure configurable via an env var (COOKIE_SECURE=true/false).
      Default to true in production, allow false in .env for local dev.
    - Do NOT change the public API contract of any endpoint.
    - Do NOT rewrite files that aren't broken. Minimal diffs.
    - Do NOT touch the database, migrations, or content files.

  After edits, VERIFY by running:
    curl -i -s -c /tmp/sagzfx_cookies2.txt -X POST http://127.0.0.1:8000/api/v1/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"test1@sagzfx.dev","password":"testpass1234"}'
    curl -i -s -b /tmp/sagzfx_cookies2.txt http://127.0.0.1:8000/api/v1/auth/me

  Both must return 200. Paste both outputs.

HARD CONSTRAINTS:
  - Phase 1 = read only. No edits at all.
  - Do NOT run `git commit`, `git push`, `git checkout`, or `git reset`.
  - Do NOT delete any file.
  - Do NOT edit .env directly unless the fix explicitly requires a new env
    var — and if so, ADD the var, don't remove others.
  - If the fix requires the backend to reload, tell the operator to restart
    uvicorn rather than doing it yourself.
  - Do NOT touch anything in frontend/src/app/module/ or frontend/src/components/Markdown.tsx.

WHEN DONE:
  - Report the root cause in one sentence.
  - List every file changed and what changed.
  - Paste the final verification curl outputs.
  - Note any follow-up the operator must do (e.g. restart uvicorn).
