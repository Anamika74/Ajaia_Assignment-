import { createClient } from "@libsql/client";

// Same code runs against a local file (dev) or Turso (deploy).
export const db = createClient({
  url: process.env.DATABASE_URL ?? "file:local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

let ready: Promise<unknown> | null = null;
export function init() {
  if (!ready) {
    ready = db.batch([
      `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS documents (
         id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id),
         title TEXT NOT NULL, content TEXT NOT NULL DEFAULT '', updated_at INTEGER NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS shares (
         doc_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
         user_id TEXT NOT NULL REFERENCES users(id),
         role TEXT NOT NULL CHECK (role IN ('edit','view')),
         PRIMARY KEY (doc_id, user_id))`,
      `INSERT OR IGNORE INTO users VALUES ('u1','Alice Rao','alice@ajaia.test')`,
      `INSERT OR IGNORE INTO users VALUES ('u2','Bob Mehta','bob@ajaia.test')`,
      `INSERT OR IGNORE INTO users VALUES ('u3','Carol Das','carol@ajaia.test')`,
    ], "write");
  }
  return ready;
}
