import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../build/client");
const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".data": "text/x-script; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const fileInfo = (path) => stat(path).catch(() => null);

function isInside(root, path) {
  const child = relative(root, path);
  return child === "" || (!child.startsWith(`..${sep}`) && child !== "..");
}

async function sendFile(request, response, path, status = 200) {
  const info = await fileInfo(path);
  if (!info?.isFile()) return false;

  response.writeHead(status, {
    "Content-Length": info.size,
    "Content-Type": CONTENT_TYPES[extname(path)] || "application/octet-stream",
  });
  if (request.method === "HEAD") response.end();
  else createReadStream(path).pipe(response);
  return true;
}

export function createStaticServer(root = DEFAULT_ROOT) {
  const documentRoot = resolve(root);

  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      let pathname;
      try {
        pathname = decodeURIComponent(url.pathname);
      } catch {
        response.writeHead(400).end("Bad Request");
        return;
      }

      const requestedPath = resolve(documentRoot, pathname.replace(/^\/+/, ""));
      if (!isInside(documentRoot, requestedPath)) {
        if (!(await sendFile(request, response, join(documentRoot, "404.html"), 404))) {
          response.writeHead(404).end("Not Found");
        }
        return;
      }

      let path = requestedPath;
      const info = await fileInfo(path);
      if (info?.isDirectory()) {
        if (!pathname.endsWith("/")) {
          response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
          return;
        }
        path = join(path, "index.html");
      }

      if (await sendFile(request, response, path)) return;
      if (await sendFile(request, response, join(documentRoot, "404.html"), 404)) return;
      response.writeHead(404).end("Not Found");
    } catch {
      response.writeHead(500).end("Internal Server Error");
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  const root = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_ROOT;
  createStaticServer(root).listen(port, "127.0.0.1", () => {
    console.log(`Static catalog available at http://127.0.0.1:${port}`);
  });
}
