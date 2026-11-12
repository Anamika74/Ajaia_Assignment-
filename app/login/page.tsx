"use client";
import { useRouter } from "next/navigation";

const USERS = [
  { id: "u1", name: "Alice Rao", email: "alice@ajaia.test" },
  { id: "u2", name: "Bob Mehta", email: "bob@ajaia.test" },
  { id: "u3", name: "Carol Das", email: "carol@ajaia.test" },
];
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("");

export default function Login() {
  const router = useRouter();
  async function pick(userId: string) {
    await fetch("/api/login", { method: "POST", body: JSON.stringify({ userId }) });
    router.push("/"); router.refresh();
  }
  return (
    <div className="login">
      <h1>Ajaia Docs</h1>
      <p className="meta" style={{ marginTop: 0 }}>Demo accounts, no password. Choose who to sign in as.</p>
      {USERS.map((u) => (
        <button key={u.id} onClick={() => pick(u.id)}>
          <span className="avatar">{initials(u.name)}</span>
          <span>{u.name}<span className="meta">{u.email}</span></span>
        </button>
      ))}
    </div>
  );
}
