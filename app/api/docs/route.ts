import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { createDoc } from "@/lib/docs";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { title } = await req.json().catch(() => ({}));
  const id = await createDoc(user.id, (typeof title === "string" && title.trim()) || "Untitled document");
  return NextResponse.json({ id });
}
