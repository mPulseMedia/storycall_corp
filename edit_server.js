#!/usr/bin/env node
/**
 * Local edit server for scenarios.html (and other static files).
 * - Serves files from repo root
 * - Accepts POST /__save { file, id, text } and rewrites the element with data-edit-id="id"
 *
 * Run:
 *   node edit_server.js
 * Then open:
 *   http://127.0.0.1:8787/scenarios.html
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname);
const PORT = Number(process.env.PORT || 8787);

function safeJoin(root, rel) {
  const clean = String(rel || "").replace(/\\/g, "/").replace(/^\/+/, "");
  if (clean.split("/").includes("..")) throw new Error("bad path");
  const out = path.resolve(root, clean);
  if (!out.startsWith(root + path.sep)) throw new Error("bad path");
  return out;
}

function escapeHtmlText(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceEditId(htmlText, editId, newText) {
  const escaped = escapeHtmlText(newText);
  const re = new RegExp(
    `(<(?<tag>[A-Za-z0-9]+)(?<attrs>[^>]*\\sdata-edit-id="${editId.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )}"[^>]*)>)(?<inner>[\\s\\S]*?)(</\\k<tag>>)`
  );

  const m = htmlText.match(re);
  if (!m || !m.groups) throw new Error(`edit id not found: ${editId}`);

  const start = m.index + m[1].length;
  const end = start + m.groups.inner.length;
  return htmlText.slice(0, start) + escaped + htmlText.slice(end);
}

function contentTypeFor(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => (buf += chunk));
    req.on("end", () => resolve(buf));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");

  if (req.method === "POST" && url.pathname === "/__save") {
    try {
      const raw = await readBody(req);
      const payload = JSON.parse(raw || "{}");
      const file = payload.file;
      const id = payload.id;
      const text = payload.text ?? "";
      if (!file || !id) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Missing file or id");
        return;
      }

      const target = safeJoin(ROOT, file);
      const page = fs.readFileSync(target, "utf8");
      const updated = replaceEditId(page, id, text);
      fs.writeFileSync(target, updated, "utf8");

      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("ok");
      return;
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(String(e && e.stack ? e.stack : e));
      return;
    }
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method not allowed");
    return;
  }

  let pathname = url.pathname;
  if (pathname === "/") pathname = "/scenarios.html";

  try {
    const filePath = safeJoin(ROOT, pathname);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentTypeFor(filePath) });
    if (req.method === "HEAD") {
      res.end();
    } else {
      res.end(data);
    }
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(e && e.stack ? e.stack : e));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Edit server running: http://127.0.0.1:${PORT}`);
  console.log(`Open: http://127.0.0.1:${PORT}/scenarios.html`);
});

