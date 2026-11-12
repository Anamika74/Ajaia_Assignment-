import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { loadDoc } from "@/lib/docs";
import Editor from "@/components/Editor";

export const dynamic = "force-dynamic";

export default async function DocPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const found = await loadDoc(params.id, user.id);
  if (!found || !found.role) notFound(); // same response for missing and forbidden
  const { doc, shares, role } = found;
  return (
    <Editor id={doc.id} initialTitle={doc.title} initialContent={doc.content} role={role}
      shares={role === "owner" ? shares : []} />
  );
}
