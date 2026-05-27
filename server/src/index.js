import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "data", "database.json");
const PORT = Number(process.env.PORT || 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-change-this-secret-before-production";
const SESSION_COOKIE = "ba_session";
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 150;
const rateBuckets = new Map();

function json(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": CLIENT_ORIGIN,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    ...headers,
  });
  res.end(JSON.stringify(body));
}

async function readDb() {
  return JSON.parse(await readFile(DB_PATH, "utf8"));
}

async function writeDb(db) {
  await mkdir(dirname(DB_PATH), { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (stored === "demo") return password === "admin123";
  const [salt, hash] = stored.split(":");
  const attempt = hashPassword(password, salt).split(":")[1];
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(attempt, "hex"));
}

function sign(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

function verify(token) {
  if (!token || !token.includes(".")) return null;
  const [encoded, sig] = token.split(".");
  const expected = createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (payload.exp && payload.exp < Date.now()) return null;
  return payload;
}

function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || "").split(";").filter(Boolean).map((part) => {
    const [key, ...value] = part.trim().split("=");
    return [key, decodeURIComponent(value.join("="))];
  }));
}

async function readBody(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function rateLimit(req) {
  const key = req.socket.remoteAddress || "local";
  const now = Date.now();
  const bucket = rateBuckets.get(key) || { count: 0, reset: now + RATE_LIMIT_WINDOW };
  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + RATE_LIMIT_WINDOW;
  }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  return bucket.count <= RATE_LIMIT_MAX;
}

async function requireUser(req, res) {
  const session = verify(parseCookies(req)[SESSION_COOKIE]);
  if (!session) {
    json(res, 401, { error: "Authentication required" });
    return null;
  }
  return session;
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function handle(req, res) {
  if (!rateLimit(req)) return json(res, 429, { error: "Too many requests" });
  if (req.method === "OPTIONS") return json(res, 204, {});

  const url = new URL(req.url, `http://${req.headers.host}`);
  if (!url.pathname.startsWith("/api")) return json(res, 404, { error: "Not found" });

  if (url.pathname === "/api/health") return json(res, 200, { ok: true });

  const db = await readDb();

  if (url.pathname === "/api/auth/login" && req.method === "POST") {
    const { email, password } = await readBody(req);
    const user = db.users.find((item) => item.email.toLowerCase() === String(email || "").toLowerCase());
    if (!user || !verifyPassword(String(password || ""), user.passwordHash)) {
      return json(res, 401, { error: "Invalid email or password" });
    }
    const token = sign({ sub: user.id, role: user.role, exp: Date.now() + 8 * 60 * 60 * 1000 });
    return json(res, 200, { user: publicUser(user) }, {
      "Set-Cookie": `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`,
    });
  }

  if (url.pathname === "/api/auth/logout" && req.method === "POST") {
    return json(res, 200, { ok: true }, {
      "Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
    });
  }

  const session = await requireUser(req, res);
  if (!session) return;

  if (url.pathname === "/api/auth/me") {
    const user = db.users.find((item) => item.id === session.sub);
    return json(res, 200, { user: user ? publicUser(user) : null });
  }

  if (url.pathname === "/api/bootstrap" && req.method === "GET") {
    const { users, auditLogs, ...data } = db;
    return json(res, 200, data);
  }

  const collections = ["employees", "installations", "documents", "inspections", "routes", "notifications"];
  const collection = collections.find((name) => url.pathname === `/api/${name}`);
  if (collection && req.method === "GET") return json(res, 200, db[collection]);

  if (collection && req.method === "POST") {
    const body = await readBody(req);
    const next = { ...body, id: body.id || Date.now() };
    db[collection].push(next);
    db.auditLogs.push({ id: Date.now(), userId: session.sub, action: `create:${collection}`, at: new Date().toISOString() });
    await writeDb(db);
    return json(res, 201, next);
  }

  return json(res, 404, { error: "Route not found" });
}

if (!existsSync(DB_PATH)) {
  throw new Error(`Missing database file: ${DB_PATH}`);
}

createServer((req, res) => {
  handle(req, res).catch((error) => json(res, 500, { error: error.message }));
}).listen(PORT, "127.0.0.1", () => {
  console.log(`API running on http://127.0.0.1:${PORT}`);
});
