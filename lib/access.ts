// Pure permission logic: no DB, no framework. Easy to unit test.
export type Role = "owner" | "edit" | "view";
export type Share = { user_id: string; role: "edit" | "view" };

export function resolveRole(userId: string, ownerId: string, shares: Share[]): Role | null {
  if (userId === ownerId) return "owner";
  return shares.find((s) => s.user_id === userId)?.role ?? null;
}
export const canRead = (r: Role | null) => r !== null;
export const canEdit = (r: Role | null) => r === "owner" || r === "edit";
export const canShare = (r: Role | null) => r === "owner";
