import { marked } from "marked";
import mammoth from "mammoth";

export const ALLOWED = [".txt", ".md", ".docx"];
export const MAX_BYTES = 2 * 1024 * 1024;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Turns an uploaded file into HTML. The caller sanitises the result.
export async function fileToHtml(name: string, buf: Buffer): Promise<string> {
  const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED.includes(ext)) throw new Error(`Unsupported file type. Use ${ALLOWED.join(", ")}.`);
  if (buf.length > MAX_BYTES) throw new Error("File is larger than 2 MB.");
  if (ext === ".docx") return (await mammoth.convertToHtml({ buffer: buf })).value;
  const text = buf.toString("utf8");
  if (ext === ".md") return await marked.parse(text);
  return text.split(/\n{2,}/).filter(Boolean).map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");
}
