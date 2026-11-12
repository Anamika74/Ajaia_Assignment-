import { describe, it, expect } from "vitest";
import { fileToHtml } from "../lib/import";

describe("file import", () => {
  it("converts markdown to HTML", async () => {
    expect(await fileToHtml("a.md", Buffer.from("# Hi\n\n- one"))).toContain("<h1");
  });
  it("escapes html in txt files", async () => {
    expect(await fileToHtml("a.txt", Buffer.from("<script>x</script>"))).toContain("&lt;script&gt;");
  });
  it("rejects unsupported types", async () => {
    await expect(fileToHtml("a.exe", Buffer.from("x"))).rejects.toThrow(/Unsupported/);
  });
});
