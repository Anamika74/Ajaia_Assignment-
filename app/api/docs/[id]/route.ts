import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canEdit, canRead } from "@/lib/access";
import { clean, loadDoc, MAX_CONTENT, MAX_TITLE } from "@/lib/docs";

type Ctx = { params: { id: string } };
const err = (m: string, s: number) => NextResponse.json({ error: m }, { status: s });

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await currentUser();
  if (!user) return err("Not signed in", 401);
  const found = await loadDoc(params.id, user.id);
  if (!found || !canRead(found.role)) return err("Document not found", 404); // don't leak existence
  if (!canEdit(found.role)) return err("You have view-only access", 403);

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid JSON", 400);
  const sets: string[] = [], args: any[] = [];
  if (body.title !== undefined) {
    const t = String(body.title).trim();
    if (!t || t.length > MAX_TITLE) return err(`Title must be 1–${MAX_TITLE} characters`, 400);
    sets.push("title=?"); args.push(t);
  }
  if (body.content !== undefined) {
    if (typeof body.content !== "string" || body.content.length > MAX_CONTENT) return err("Content too large", 413);
    sets.push("content=?"); args.push(clean(body.content));
  }
  if (!sets.length) return err("Nothing to update", 400);
  await db.execute({ sql: `UPDATE documents SET ${sets.join(",")}, updated_at=? WHERE id=?`, args: [...args, Date.now(), params.id] });
  return NextResponse.json({ ok: true });
}
