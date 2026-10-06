import inspect
import unittest

from fastapi import Response

from app.api.v1.auth import _clear_auth_cookies, _set_auth_cookies
from app.api import deps


class AuthCookieSecurityTests(unittest.TestCase):
    def test_auth_cookies_are_httponly_secure_and_cross_site_compatible(self):
        response = Response()
        _set_auth_cookies(response, "access-token", "refresh-token")
        headers = response.headers.getlist("set-cookie")
        self.assertEqual(len(headers), 2)
        for header in headers:
            lower = header.lower()
            self.assertIn("httponly", lower)
            self.assertIn("secure", lower)
            self.assertIn("samesite=none", lower)
            self.assertIn("path=/", lower)

    def test_logout_expires_both_auth_cookies(self):
        response = Response()
        _clear_auth_cookies(response)
        headers = response.headers.getlist("set-cookie")
        joined = "\n".join(headers).lower()
        self.assertIn("sagzfx_access=", joined)
        self.assertIn("sagzfx_refresh=", joined)
        self.assertIn("max-age=0", joined)

    def test_current_user_supports_cookie_credential(self):
        source = inspect.getsource(deps.get_current_user)
        self.assertIn("access_cookie or token", source)
        self.assertIn('alias="sagzfx_access"', inspect.getsource(deps))


class BrowserTokenStorageContractTests(unittest.TestCase):
    def test_frontend_api_does_not_persist_jwt_in_local_storage(self):
        with open("frontend/src/lib/api.ts", encoding="utf-8") as handle:
            source = handle.read()
        self.assertNotIn("localStorage.setItem", source)
        self.assertNotIn("localStorage.getItem", source)
        self.assertIn('credentials: "include"', source)


if __name__ == "__main__":
    unittest.main()
