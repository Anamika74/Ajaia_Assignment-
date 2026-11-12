"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import SharePanel from "./SharePanel";

type Props = { id: string; initialTitle: string; initialContent: string; role: "owner" | "edit" | "view"; shares: any[] };
type Status = "saved" | "saving" | "error";

// Defined OUTSIDE Editor on purpose. When it lived inside, React saw a "new" component on every
// keystroke/selection change and rebuilt the buttons, which swallowed the first click.
function Btn({ label, title, on, run, disabled }: { label: React.ReactNode; title: string; on: boolean; run: () => void; disabled: boolean }) {
  return (
    <button
      type="button" className={`tb${on ? " on" : ""}`} title={title} aria-label={title} aria-pressed={on}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep focus and selection inside the editor
      onClick={run}
    >{label}</button>
  );
}

export default function Editor({ id, initialTitle, initialContent, role, shares }: Props) {
  const readOnly = role === "view";
  const [title, setTitle] = useState(initialTitle);
  const savedTitle = useRef(initialTitle);
  const [status, setStatus] = useState<Status>("saved");
  const [showShare, setShowShare] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  async function save(patch: object) {
    setStatus("saving");
    const res = await fetch(`/api/docs/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    setStatus(res.ok ? "saved" : "error");
    return res.ok;
  }

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } }), Underline],
    content: initialContent,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {           // debounced autosave: one request per pause in typing
      clearTimeout(timer.current);
      setStatus("saving");
      timer.current = setTimeout(() => save({ content: editor.getHTML() }), 800);
    },
  });
  useEffect(() => () => clearTimeout(timer.current), []);

  async function saveTitle() {
    const t = title.trim();
    if (!t) return setTitle(savedTitle.current);       // never save an empty title
    if (t === savedTitle.current) return;
    if (await save({ title: t })) savedTitle.current = t;
  }

  const run = () => editor!.chain().focus();
  const d = readOnly;

  return (
    <>
      <div className="bar">
        <Link href="/" className="meta">← Documents</Link>
        <input className="title" value={title} readOnly={readOnly} aria-label="Document title"
          onChange={(e) => setTitle(e.target.value)} onBlur={saveTitle}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} />
        <span className="grow meta" aria-live="polite">
          {readOnly ? "View only" : status === "saving" ? "Saving…" : status === "error" ? "Not saved, check your connection" : "Saved"}
        </span>
        {role === "owner" && <button onClick={() => setShowShare(!showShare)}>Share</button>}
      </div>
      {showShare && <SharePanel id={id} shares={shares} />}
      {editor && (
        <div className="toolbar" role="toolbar" aria-label="Formatting">
          <Btn label={<b>B</b>} title="Bold" on={editor.isActive("bold")} disabled={d} run={() => run().toggleBold().run()} />
          <Btn label={<i>I</i>} title="Italic" on={editor.isActive("italic")} disabled={d} run={() => run().toggleItalic().run()} />
          <Btn label={<u>U</u>} title="Underline" on={editor.isActive("underline")} disabled={d} run={() => run().toggleUnderline().run()} />
          <span className="sep" />
          <Btn label="H1" title="Heading 1" on={editor.isActive("heading", { level: 1 })} disabled={d} run={() => run().toggleHeading({ level: 1 }).run()} />
          <Btn label="H2" title="Heading 2" on={editor.isActive("heading", { level: 2 })} disabled={d} run={() => run().toggleHeading({ level: 2 }).run()} />
          <span className="sep" />
          <Btn label="• List" title="Bulleted list" on={editor.isActive("bulletList")} disabled={d} run={() => run().toggleBulletList().run()} />
          <Btn label="1. List" title="Numbered list" on={editor.isActive("orderedList")} disabled={d} run={() => run().toggleOrderedList().run()} />
        </div>
      )}
      <div className="page"><EditorContent editor={editor} /></div>
    </>
  );
}
