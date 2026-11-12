"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type S = { user_id: string; role: string; name: string; email: string };

export default function SharePanel({ id, shares }: { id: string; shares: S[] }) {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [role, setRole] = useState("view"); const [error, setError] = useState("");

  async function call(method: string, body: object) {
    setError("");
    const res = await fetch(`/api/docs/${id}/share`, { method, body: JSON.stringify(body) });
    if (!res.ok) return setError((await res.json()).error ?? "Failed");
    setEmail(""); router.refresh();
  }
  return (
    <div className="panel" role="dialog" aria-label="Share document">
      <strong>Share this document</strong>
      <input placeholder="Email, e.g. bob@ajaia.test" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
      <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Permission">
        <option value="view">Can view</option><option value="edit">Can edit</option>
      </select>
      <button className="primary" onClick={() => call("POST", { email, role })}>Share</button>
      {error && <div className="err" role="alert">{error}</div>}
      <div style={{ marginTop: 12 }}>
        {shares.length === 0 && <span className="meta">Not shared with anyone yet.</span>}
        {shares.map((s) => (
          <div key={s.user_id} style={{ display: "flex", justifyContent: "space-between", margin: "6px 0" }}>
            <span>{s.name} <span className="meta">{s.role === "edit" ? "editor" : "viewer"}</span></span>
            <button onClick={() => call("DELETE", { userId: s.user_id })}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
