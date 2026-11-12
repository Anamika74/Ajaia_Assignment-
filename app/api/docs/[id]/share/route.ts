import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canShare } from "@/lib/access";
import { loadDoc } from "@/lib/docs";

type Ctx = { params: { id: string } };
const err = (m: string, s: number) => NextResponse.json({ error: m }, { status: s });

async function guard(id: string) {
  const user = await currentUser();
  if (!user) return { e: err("Not signed in", 401) };
  const found = await loadDoc(id, user.id);
  if (!found || !found.role) return { e: err("Document not found", 404) };
  if (!canShare(found.role)) return { e: err("Only the owner can manage sharing", 403) };
  return { user, found };
}

export async function POST(req: Request, { params }: Ctx) {
  const g = await guard(params.id);
  if (g.e) return g.e;
  const { email, role } = await req.json().catch(() => ({}));
  if (role !== "edit" && role !== "view") return err("Role must be 'edit' or 'view'", 400);
  const r = await db.execute({ sql: "SELECT id FROM users WHERE email=?", args: [String(email ?? "").trim().toLowerCase()] });
  const target = r.rows[0] as any;
  if (!target) return err("No user with that email", 404);
  if (target.id === g.user!.id) return err("You already own this document", 400);
  await db.execute({
    sql: "INSERT INTO shares VALUES (?,?,?) ON CONFLICT(doc_id,user_id) DO UPDATE SET role=excluded.role",
    args: [params.id, target.id, role],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const g = await guard(params.id);
  if (g.e) return g.e;
  const { userId } = await req.json().catch(() => ({}));
  await db.execute({ sql: "DELETE FROM shares WHERE doc_id=? AND user_id=?", args: [params.id, String(userId)] });
  return NextResponse.json({ ok: true });
}
