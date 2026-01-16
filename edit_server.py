#!/usr/bin/env python3
import html
import json
import os
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


ROOT = os.path.abspath(os.path.dirname(__file__))
DEFAULT_PORT = 8787


def _safe_join(root: str, rel: str) -> str:
    rel = rel.lstrip("/").replace("\\", "/")
    if ".." in rel.split("/"):
        raise ValueError("bad path")
    out = os.path.abspath(os.path.join(root, rel))
    if not out.startswith(root + os.sep):
        raise ValueError("bad path")
    return out


def _replace_edit_id(html_text: str, edit_id: str, new_text: str) -> str:
    # Only replaces the *inner content* of a tag that has data-edit-id="...".
    # We store plain text (escaped) so it stays safe and predictable.
    escaped = html.escape(new_text, quote=False)

    pattern = re.compile(
        r'(<(?P<tag>[a-zA-Z0-9]+)(?P<attrs>[^>]*\sdata-edit-id="' + re.escape(edit_id) + r'"[^>]*)>)'
        r'(?P<inner>[\s\S]*?)'
        r'(</(?P=tag)>)',
        re.MULTILINE,
    )

    match = pattern.search(html_text)
    if not match:
        raise KeyError(f"edit id not found: {edit_id}")

    start, end = match.span("inner")
    return html_text[:start] + escaped + html_text[end:]


class Handler(BaseHTTPRequestHandler):
    def _send(self, status: int, body: bytes, content_type: str = "text/plain; charset=utf-8"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/":
            path = "/scenarios.html"
        try:
            file_path = _safe_join(ROOT, path)
            if not os.path.isfile(file_path):
                self._send(404, b"Not found")
                return
            with open(file_path, "rb") as f:
                data = f.read()
            ctype = "text/html; charset=utf-8"
            if file_path.endswith(".css"):
                ctype = "text/css; charset=utf-8"
            elif file_path.endswith(".js"):
                ctype = "text/javascript; charset=utf-8"
            elif file_path.endswith(".png"):
                ctype = "image/png"
            elif file_path.endswith(".jpg") or file_path.endswith(".jpeg"):
                ctype = "image/jpeg"
            elif file_path.endswith(".webp"):
                ctype = "image/webp"
            self._send(200, data, ctype)
        except Exception as e:
            self._send(500, str(e).encode("utf-8"))

    def do_POST(self):
        if self.path.split("?", 1)[0] != "/__save":
            self._send(404, b"Not found")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length)
            payload = json.loads(raw.decode("utf-8"))

            rel_file = payload.get("file")
            edit_id = payload.get("id")
            text = payload.get("text", "")
            if not rel_file or not edit_id:
                self._send(400, b"Missing file or id")
                return

            target = _safe_join(ROOT, rel_file)
            if not os.path.isfile(target):
                self._send(404, b"File not found")
                return

            with open(target, "r", encoding="utf-8") as f:
                page = f.read()

            updated = _replace_edit_id(page, edit_id, text)

            with open(target, "w", encoding="utf-8") as f:
                f.write(updated)

            self._send(200, b"ok")
        except KeyError as e:
            self._send(400, str(e).encode("utf-8"))
        except Exception as e:
            self._send(500, str(e).encode("utf-8"))


def main():
    port = int(os.environ.get("PORT", str(DEFAULT_PORT)))
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Edit server running on http://127.0.0.1:{port}")
    print("Open /scenarios.html, then double-click StoryCall text to edit.")
    server.serve_forever()


if __name__ == "__main__":
    main()

