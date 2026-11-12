"use client";
import { useRouter } from "next/navigation";
export default function SignOut() {
  const router = useRouter();
  return <button onClick={async () => { await fetch("/api/login", { method: "DELETE" }); router.push("/login"); router.refresh(); }}>Switch user</button>;
}
