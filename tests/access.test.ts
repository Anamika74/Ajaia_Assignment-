import { describe, it, expect } from "vitest";
import { resolveRole, canEdit, canRead, canShare } from "../lib/access";

const shares = [{ user_id: "bob", role: "view" as const }, { user_id: "cat", role: "edit" as const }];

describe("access rules", () => {
  it("owner can read, edit and share", () => {
    const r = resolveRole("alice", "alice", shares);
    expect([canRead(r), canEdit(r), canShare(r)]).toEqual([true, true, true]);
  });
  it("viewer can read but not edit or share", () => {
    const r = resolveRole("bob", "alice", shares);
    expect([canRead(r), canEdit(r), canShare(r)]).toEqual([true, false, false]);
  });
  it("editor can edit but not share", () => {
    const r = resolveRole("cat", "alice", shares);
    expect([canEdit(r), canShare(r)]).toEqual([true, false]);
  });
  it("stranger gets nothing", () => {
    const r = resolveRole("dan", "alice", shares);
    expect(r).toBeNull();
    expect(canRead(r)).toBe(false);
  });
});
