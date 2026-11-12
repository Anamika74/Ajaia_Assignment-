"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDoc() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function go(url: string, init: RequestInit) {
    setBusy(true); setError("");
    const res = await fetch(url, init);
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong");
    router.push(`/doc/${data.id}`);
  }
  return (
    <div>
      <button className="primary" disabled={busy} onClick={() => go("/api/docs", { method: "POST", body: "{}" })}>New document</button>{" "}
      <button disabled={busy} onClick={() => fileRef.current?.click()}>Import file</button>
      <span className="meta"> Accepts .txt, .md, .docx up to 2 MB</span>
      <input ref={fileRef} type="file" accept=".txt,.md,.docx" hidden onChange={(e) => {
        const f = e.target.files?.[0]; if (!f) return;
        const fd = new FormData(); fd.append("file", f);
        go("/api/import", { method: "POST", body: fd }); e.target.value = "";
      }} />
      {error && <div className="err" role="alert">{error}</div>}
    </div>
  );
}
