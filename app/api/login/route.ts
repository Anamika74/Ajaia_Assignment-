import { NextResponse } from "next/server";
import { db, init } from "@/lib/db";

export async function POST(req: Request) {
  await init();
  const { userId } = await req.json().catch(() => ({}));
  const r = await db.execute({ sql: "SELECT id FROM users WHERE id=?", args: [String(userId)] });
  if (!r.rows[0]) return NextResponse.json({ error: "Unknown user" }, { status: 400 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("uid", String(userId), { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("uid");
  return res;
}
