import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { createDoc } from "@/lib/docs";
import { fileToHtml } from "@/lib/import";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  try {
    const html = await fileToHtml(file.name, Buffer.from(await file.arrayBuffer()));
    const title = file.name.replace(/\.[^.]+$/, "") || "Imported document";
    return NextResponse.json({ id: await createDoc(user.id, title, html) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Could not read file" }, { status: 400 });
  }
}
