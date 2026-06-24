const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { URL } = require("node:url");
const { DatabaseSync } = require("node:sqlite");

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, "rap_lyric_lab.sqlite");
const PORT = Number(process.env.PORT || 5173);
const MAX_BODY_BYTES = 2.5 * 1024 * 1024;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
const STATIC_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profile_snapshots (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    payload TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS history_items (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    lyric_text TEXT NOT NULL,
    review_json TEXT,
    rapper TEXT,
    album TEXT,
    keyword TEXT,
    theme TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const statements = {
  getUserByUsername: db.prepare("SELECT * FROM users WHERE username = ?"),
  getUserById: db.prepare("SELECT id, username, display_name FROM users WHERE id = ?"),
  createUser: db.prepare(`
    INSERT INTO users (username, display_name, password_hash, password_salt, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `),
  updateUserPassword: db.prepare(`
    UPDATE users
    SET password_hash = ?, password_salt = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  createSession: db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)"),
  getSession: db.prepare(`
    SELECT sessions.token, sessions.expires_at, users.id, users.username, users.display_name
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = ?
  `),
  deleteSession: db.prepare("DELETE FROM sessions WHERE token = ?"),
  deleteExpiredSessions: db.prepare("DELETE FROM sessions WHERE expires_at < ?"),
  getProfile: db.prepare("SELECT payload FROM profile_snapshots WHERE user_id = ?"),
  upsertProfile: db.prepare(`
    INSERT INTO profile_snapshots (user_id, payload, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET payload = excluded.payload, updated_at = CURRENT_TIMESTAMP
  `),
  listHistory: db.prepare(`
    SELECT id, title, lyric_text, review_json, rapper, album, keyword, theme, created_at
    FROM history_items
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 8
  `),
  insertHistory: db.prepare(`
    INSERT OR REPLACE INTO history_items
      (id, user_id, title, lyric_text, review_json, rapper, album, keyword, theme, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  pruneHistory: db.prepare(`
    DELETE FROM history_items
    WHERE user_id = ?
      AND id NOT IN (
        SELECT id FROM history_items
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 8
      )
  `),
  clearHistory: db.prepare("DELETE FROM history_items WHERE user_id = ?")
};

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(String(password), Buffer.from(salt, "hex"), 120000, 32, "sha256").toString("hex");
  return { hash, salt };
}

function verifyPassword(password, row) {
  const { hash } = hashPassword(password, row.password_salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(row.password_hash, "hex"));
}

function jsonResponse(res, status, payload, headers = {}) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers
  });
  res.end(JSON.stringify(payload));
}

function errorResponse(res, status, message) {
  jsonResponse(res, status, { error: message });
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1 ? [part, ""] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function sessionCookie(token, maxAge = SESSION_TTL_MS / 1000) {
  return `rap_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(maxAge)}`;
}

function clearSessionCookie() {
  return "rap_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("请求体太大。"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8") || "{}";
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("JSON 格式不正确。"));
      }
    });
    req.on("error", reject);
  });
}

function currentSession(req) {
  statements.deleteExpiredSessions.run(Date.now());
  const token = parseCookies(req.headers.cookie).rap_session;
  if (!token) return null;
  const session = statements.getSession.get(token);
  if (!session || session.expires_at < Date.now()) return null;
  return session;
}

function requireUser(req, res) {
  const session = currentSession(req);
  if (!session) {
    errorResponse(res, 401, "请先登录。");
    return null;
  }
  return session;
}

async function handleApi(req, res, pathname) {
  try {
    if (req.method === "GET" && pathname === "/api/health") {
      jsonResponse(res, 200, { ok: true, database: "sqlite", persistent: true });
      return;
    }

    if (req.method === "GET" && pathname === "/api/me") {
      const session = currentSession(req);
      jsonResponse(res, 200, {
        authenticated: Boolean(session),
        user: session ? { id: session.id, username: session.username, displayName: session.display_name } : null
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/auth/login") {
      const body = await readBody(req);
      const username = normalizeUsername(body.username);
      const password = String(body.password || "");
      if (!username || password.length < 1) {
        errorResponse(res, 400, "请输入账号和密码。");
        return;
      }

      let user = statements.getUserByUsername.get(username);
      if (!user) {
        const { hash, salt } = hashPassword(password);
        statements.createUser.run(username, body.username.trim().slice(0, 32), hash, salt);
        user = statements.getUserByUsername.get(username);
      } else if (!verifyPassword(password, user)) {
        errorResponse(res, 401, "密码不正确。");
        return;
      }

      const token = crypto.randomBytes(32).toString("hex");
      statements.createSession.run(token, user.id, Date.now() + SESSION_TTL_MS);
      jsonResponse(
        res,
        200,
        { user: { id: user.id, username: user.username, displayName: user.display_name } },
        { "set-cookie": sessionCookie(token) }
      );
      return;
    }

    if (req.method === "POST" && pathname === "/api/auth/logout") {
      const token = parseCookies(req.headers.cookie).rap_session;
      if (token) statements.deleteSession.run(token);
      jsonResponse(res, 200, { ok: true }, { "set-cookie": clearSessionCookie() });
      return;
    }

    if (req.method === "GET" && pathname === "/api/profiles") {
      const user = requireUser(req, res);
      if (!user) return;
      const row = statements.getProfile.get(user.id);
      jsonResponse(res, 200, { profiles: row ? JSON.parse(row.payload) : null });
      return;
    }

    if (req.method === "PUT" && pathname === "/api/profiles") {
      const user = requireUser(req, res);
      if (!user) return;
      const body = await readBody(req);
      const payload = JSON.stringify(body.profiles || {});
      statements.upsertProfile.run(user.id, payload);
      jsonResponse(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && pathname === "/api/history") {
      const user = requireUser(req, res);
      if (!user) return;
      const items = statements.listHistory.all(user.id).map((item) => ({
        id: item.id,
        title: item.title,
        text: item.lyric_text,
        review: item.review_json ? JSON.parse(item.review_json) : null,
        rapper: item.rapper,
        album: item.album,
        keyword: item.keyword,
        theme: item.theme,
        createdAt: item.created_at
      }));
      jsonResponse(res, 200, { items });
      return;
    }

    if (req.method === "POST" && pathname === "/api/history") {
      const user = requireUser(req, res);
      if (!user) return;
      const body = await readBody(req);
      const id = String(body.id || crypto.randomUUID()).slice(0, 80);
      statements.insertHistory.run(
        id,
        user.id,
        String(body.title || "Untitled").slice(0, 160),
        String(body.text || "").slice(0, 20000),
        JSON.stringify(body.review || null),
        String(body.rapper || "").slice(0, 80),
        String(body.album || "").slice(0, 80),
        String(body.keyword || "").slice(0, 80),
        String(body.theme || "").slice(0, 120),
        body.createdAt || new Date().toISOString()
      );
      statements.pruneHistory.run(user.id, user.id);
      jsonResponse(res, 200, { ok: true });
      return;
    }

    if (req.method === "DELETE" && pathname === "/api/history") {
      const user = requireUser(req, res);
      if (!user) return;
      statements.clearHistory.run(user.id);
      jsonResponse(res, 200, { ok: true });
      return;
    }

    errorResponse(res, 404, "API 不存在。");
  } catch (error) {
    errorResponse(res, error.message === "请求体太大。" ? 413 : 500, error.message || "服务器错误。");
  }
}

function serveStatic(req, res, pathname) {
  const cleanPath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = path.resolve(ROOT, `.${cleanPath}`);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": STATIC_TYPES[extension] || "application/octet-stream",
      "x-content-type-options": "nosniff",
      "cache-control": extension === ".html" ? "no-cache" : "public, max-age=3600"
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname.startsWith("/api/")) {
    handleApi(req, res, url.pathname);
    return;
  }
  serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`Rap Lyric Lab running at http://localhost:${PORT}`);
  console.log(`SQLite database: ${DB_PATH}`);
});
