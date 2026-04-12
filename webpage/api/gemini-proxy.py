#!/usr/bin/env python3
"""
Gemini API Proxy for 6phene Chat Widget
Keeps the API key server-side, never exposed to the browser.
"""

import json
import os
import urllib.request
import urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler

API_KEY = os.environ.get("GEMINI_API_KEY", "")
PORT = int(os.environ.get("GEMINI_PROXY_PORT", "8090"))
ALLOWED_ORIGINS = ["https://6phene.com", "https://www.6phene.com"]
API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
MODEL_OPTIONS = ["gemini-2.0-flash", "gemini-pro", "gemini-1.5-pro-latest"]


class GeminiProxyHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        origin = self.headers.get("Origin", "")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/chat":
            self.send_response(404)
            self.end_headers()
            return

        if not API_KEY:
            self._send_json(500, {"error": "API key not configured"})
            return

        # Read request body
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            request_data = json.loads(body)
        except json.JSONDecodeError:
            self._send_json(400, {"error": "Invalid JSON"})
            return

        # Validate request has required fields
        if "contents" not in request_data:
            self._send_json(400, {"error": "Missing 'contents' field"})
            return

        # Try each model until one works
        last_error = None
        for model in MODEL_OPTIONS:
            try:
                url = f"{API_BASE}/{model}:generateContent?key={API_KEY}"
                req = urllib.request.Request(
                    url,
                    data=json.dumps(request_data).encode("utf-8"),
                    headers={
                        "Content-Type": "application/json",
                        "Referer": "https://6phene.com/",
                    },
                    method="POST",
                )
                with urllib.request.urlopen(req, timeout=30) as resp:
                    result = json.loads(resp.read().decode("utf-8"))
                    self._send_json(200, result)
                    return
            except urllib.error.HTTPError as e:
                error_body = e.read().decode("utf-8", errors="replace")
                if "not found" in error_body.lower() or "not supported" in error_body.lower():
                    last_error = error_body
                    continue
                self._send_json(e.code, {"error": error_body})
                return
            except Exception as e:
                last_error = str(e)
                continue

        self._send_json(502, {"error": f"All models failed: {last_error}"})

    def _send_json(self, status, data):
        self.send_response(status)
        self._set_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def log_message(self, format, *args):
        # Suppress default logging to avoid filling disk
        pass


if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: Set GEMINI_API_KEY environment variable")
        exit(1)
    server = HTTPServer(("127.0.0.1", PORT), GeminiProxyHandler)
    print(f"Gemini proxy running on http://127.0.0.1:{PORT}")
    server.serve_forever()
