// Serve out/ the way GitHub Pages does: plain files, folder index.html, 404.html, and no
// Content-Disposition (generic static servers add one, which overrides <a download="name">).
// Usage: node scripts/serve-static.mjs [port]
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../out/", import.meta.url).pathname;
const PORT = Number(process.argv[2] ?? 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2",
  ".mp4": "video/mp4", ".webm": "video/webm", ".vtt": "text/vtt; charset=utf-8", ".pdf": "application/pdf",
};

const isFile = (p) => statSync(p, { throwIfNoEntry: false })?.isFile();

createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  let file = join(ROOT, path);
  if (!file.startsWith(ROOT)) return res.writeHead(403).end();
  if (!isFile(file)) {
    if (isFile(join(file, "index.html"))) {
      if (!path.endsWith("/")) return res.writeHead(301, { Location: `${path}/` }).end();
      file = join(file, "index.html");
    } else {
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      return createReadStream(join(ROOT, "404.html")).pipe(res);
    }
  }
  const size = statSync(file).size;
  const type = TYPES[extname(file)] ?? "application/octet-stream";
  // byte ranges, so <video> can seek like it does on a real host
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? "");
  if (range) {
    const start = range[1] ? Number(range[1]) : size - Number(range[2]);
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1, "Accept-Ranges": "bytes" });
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
  if (req.method === "HEAD") return res.end();
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`serving out/ on http://localhost:${PORT}`));
