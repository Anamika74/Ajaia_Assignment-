import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import NewDoc from "@/components/NewDoc";
import SignOut from "@/components/SignOut";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const owned = (await db.execute({ sql: "SELECT id,title,updated_at FROM documents WHERE owner_id=? ORDER BY updated_at DESC", args: [user.id] })).rows as any[];
  const shared = (await db.execute({
    sql: `SELECT d.id,d.title,d.updated_at,s.role,u.name AS owner FROM shares s
          JOIN documents d ON d.id=s.doc_id JOIN users u ON u.id=d.owner_id
          WHERE s.user_id=? ORDER BY d.updated_at DESC`, args: [user.id] })).rows as any[];
  const when = (t: number) => new Date(t).toLocaleString();
  const initials = user.name.split(" ").map((p) => p[0]).join("");

  return (
    <>
      <div className="bar">
        <span className="brand grow">Ajaia Docs</span>
        <span className="meta">{user.name}</span>
        <span className="avatar" aria-hidden>{initials}</span>
        <SignOut />
      </div>
      <div className="wrap">
        <NewDoc />
        <h2>My documents ({owned.length})</h2>
        <div className="list">
          {owned.length === 0 && <div className="empty">No documents yet. Create one or import a file.</div>}
          {owned.map((d) => (
            <Link key={d.id} href={`/doc/${d.id}`} className="row">
              <span className="rowmain"><span className="file">{String(d.title).slice(0, 1).toUpperCase()}</span><span>{d.title}</span></span>
              <span className="meta">{when(d.updated_at)}</span>
            </Link>
          ))}
        </div>
        <h2>Shared with me ({shared.length})</h2>
        <div className="list">
          {shared.length === 0 && <div className="empty">Nothing shared with you yet.</div>}
          {shared.map((d) => (
            <Link key={d.id} href={`/doc/${d.id}`} className="row">
              <span className="rowmain">
                <span className="file">{String(d.title).slice(0, 1).toUpperCase()}</span>
                <span>{d.title}<span className="tag">{d.role === "edit" ? "Can edit" : "View only"}</span></span>
              </span>
              <span className="meta">from {d.owner}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
