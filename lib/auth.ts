import { cookies } from "next/headers";
import { db, init } from "./db";

export type User = { id: string; name: string; email: string };

// Mocked auth: a cookie holds the seeded user's id. Swap this one function for real auth later.
export async function currentUser(): Promise<User | null> {
  await init();
  const id = cookies().get("uid")?.value;
  if (!id) return null;
  const r = await db.execute({ sql: "SELECT id,name,email FROM users WHERE id=?", args: [id] });
  return (r.rows[0] as unknown as User) ?? null;
}
