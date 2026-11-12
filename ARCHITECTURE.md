# Architecture note

## Shape
One Next.js app: React UI, route handlers as the API, libSQL for storage. One deployable unit keeps setup to `npm install && npm run dev` and deployment to one Vercel project.

## Key decisions
- **TipTap editor, content stored as sanitised HTML.** TipTap (ProseMirror) gives reliable bold/italic/underline/headings/lists. HTML is human-readable, easy to import into, and round-trips with formatting intact. Every write is sanitised server-side with an allow-list of tags.
- **libSQL instead of Prisma/Postgres.** The same client talks to a local file in dev and to Turso in production, so there is one code path and no paid service. Plain SQL is enough for three tables.
- **Permissions live in one pure module (`lib/access.ts`).** Roles are owner, edit, view. Routes call `resolveRole`/`canEdit`/`canShare` rather than writing ad hoc checks, which makes the rules unit-testable.
- **404 for forbidden documents.** A user without access gets "not found", so document ids don't leak existence.
- **Mocked auth.** A cookie holds a seeded user id. `lib/auth.ts` is the only file to replace with real auth.
- **Debounced autosave** (800 ms) with a visible Saving/Saved/Error state, so there is no manual save step to forget.
- **Import is validated twice:** extension and size, then sanitised output.

## Cut on purpose
Real-time co-editing (last write wins), passwords, version history, comments, deleting documents, docx tables and images.

## Next 2-4 hours
1. Delete document and "last edited by".
2. Version history (snapshot on pause, restore button).
3. Export to Markdown/PDF.
4. Presence indicators via polling, then Yjs for real co-editing.
5. API route tests with a temp database.
