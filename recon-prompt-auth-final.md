# AUTH FINAL FIX MISSION
## SAGZFX ACADEMY — Login, redirect, and dashboard load

ROLE: You are the Auth Final Agent. Fix the remaining auth + dashboard issues
once and for all. No more iterations after this.

MISSION (STRICT, TWO-PHASE):

  PHASE 1 — RECON (read-only, no edits)
    Gather evidence. Report findings. Do NOT edit any file.

  PHASE 2 — FIX (only after Phase 1 report is produced)
    Fix the minimum set of files required. Verify with curl.

CONTEXT:
  - Backend: FastAPI on http://127.0.0.1:8000 (running, cookie auth,
    COOKIE_SECURE=false for local dev)
  - Frontend: Next.js on http://localhost:3000 (running)
  - Symptom A: dashboard shows "Failed to load dashboard. Is the backend
    running?" with a console 404 on /api/v1/mt5-demo/status.
  - Symptom B: /pricing and /module/[id] pages may have a stale getToken()
    guard (same bug pattern as the dashboard had). Users hit a redirect
    loop on those routes.
  - Symptom C: verify the mt5-demo router is actually registered in app/main.py.

PHASE 1 — RECON (read-only):

  1. Read these files IN FULL and report their contents:
       - app/main.py
       - app/api/v1/mt5_demo.py
       - app/models/course.py
       - app/schemas/mt5_demo.py
       - frontend/src/app/pricing/page.tsx
       - frontend/src/app/module/[id]/page.tsx
       - frontend/src/lib/api.ts

  2. Run and paste the output of:
       python -c "from app.main import app; [print(' ', r.path) for r in app.routes if hasattr(r, 'path')]"

     Confirm whether /api/v1/mt5-demo/status and /api/v1/mt5-demo/provision
     appear in the list.

  3. Test the mt5-demo endpoint with curl using the current logged-in
     cookie jar if available:
       curl -i -s http://127.0.0.1:8000/api/v1/mt5-demo/status

     Report the exact status code.

  4. Search the frontend for any remaining `getToken()` guards:
       grep -rn "getToken" frontend/src/
     Report every file and line number.

  5. Search the backend for any 404-raising pattern that might catch the
     mt5-demo route by mistake:
       grep -n "status_code=404\|HTTP_404\|Not Found" app/api/v1/mt5_demo.py

PHASE 2 — FIX:

  Fix every issue found in Phase 1. The following are required:

  (a) If /api/v1/mt5-demo/status is not registered in app/main.py:
      Add the import for mt5_demo router and register it with prefix=API.
      Follow the exact pattern of the other routers in the file.

  (b) If /api/v1/mt5-demo/status is registered but returns 404:
      Diagnose why. Check that the mt5_demo router has prefix="/mt5-demo"
      and that the endpoint is @router.get("/status"). Fix the path.

  (c) If frontend/src/app/pricing/page.tsx has a getToken() guard:
      Remove the guard and rely on the API's 401 response as the auth gate.
      Match the pattern already applied to dashboard/page.tsx.

  (d) If frontend/src/app/module/[id]/page.tsx has a getToken() guard:
      Same removal.

  (e) Any other stale getToken() usage found in Phase 1 step 4:
      Remove it, replace with a me() call, or leave the auth decision to
      the API's 401 handler.

  CONSTRAINTS:
    - Preserve HttpOnly cookie architecture. Do NOT revert to localStorage.
    - Do NOT change the public API contract.
    - Do NOT touch the database, migrations, content files, or docs.
    - Do NOT touch anything in frontend/content/.
    - Do NOT run git commit, git push, git checkout, or git reset.
    - Do NOT delete any file.

  VERIFY after edits:
    Run these exact commands and paste both outputs:
      python -c "from app.main import app; [print(' ', r.path) for r in app.routes if hasattr(r, 'path')]"
      curl -i -s http://127.0.0.1:8000/api/v1/mt5-demo/status

    The route must appear in the list. The curl must return a non-404 status
    (200 with a valid cookie, 401 without).

WHEN DONE:
  - Report the root cause for each symptom in one sentence.
  - List every file changed and what changed (diff-level).
  - Paste the final verification outputs.
  - Note any follow-up the operator must do (e.g. restart uvicorn).
  - If any file was NOT changed because it was already correct, say so
    explicitly.
