import sanitizeHtml from "sanitize-html";
import { db } from "./db";
import { resolveRole, Role, Share } from "./access";

// Server-side sanitising: never trust HTML from the client or from imported files.
export const clean = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ["p","h1","h2","h3","strong","em","u","ul","ol","li","br","blockquote"],
    allowedAttributes: {},
  });

export const MAX_TITLE = 120;
export const MAX_CONTENT = 500_000;

export async function loadDoc(id: string, userId: string) {
  const d = await db.execute({ sql: "SELECT * FROM documents WHERE id=?", args: [id] });
  const doc = d.rows[0] as any;
  if (!doc) return null;
  const s = await db.execute({
    sql: "SELECT s.user_id,s.role,u.name,u.email FROM shares s JOIN users u ON u.id=s.user_id WHERE s.doc_id=?",
    args: [id],
  });
  const shares = s.rows as unknown as (Share & { name: string; email: string })[];
  const role: Role | null = resolveRole(userId, doc.owner_id, shares);
  return { doc, shares, role };
}

export async function createDoc(ownerId: string, title: string, content = "") {
  const id = crypto.randomUUID();
  await db.execute({
    sql: "INSERT INTO documents VALUES (?,?,?,?,?)",
    args: [id, ownerId, title.slice(0, MAX_TITLE), clean(content), Date.now()],
  });
  return id;
}
