# Ajaia Docs

A lightweight collaborative document editor: create, rename, rich-text edit, import files, and share with view/edit roles.

**Stack:** Next.js 14 (App Router) · TypeScript · TipTap · libSQL (SQLite locally, Turso in production) · Vitest

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000, creates ./local.db and seeds users automatically
npm test           # access-rule and import tests
```
No environment variables are needed locally.

## Test accounts (no password)
| Name | Email |
|---|---|
| Alice Rao | alice@ajaia.test |
| Bob Mehta | bob@ajaia.test |
| Carol Das | carol@ajaia.test |

**Sharing demo:** sign in as Alice, create a document, click Share, enter `bob@ajaia.test` as "Can view". Click "Switch user", sign in as Bob, and the document appears under "Shared with me" with a View only tag.

## File upload
"Import file" turns `.txt`, `.md` or `.docx` (max 2 MB) into a new editable document. Other types are rejected with a message. DOCX conversion keeps headings, bold, italic and lists; images and tables are dropped.

## Deploy (free)
1. Create a Turso database (free tier): `turso db create ajaia-docs`, then `turso db tokens create ajaia-docs`.
2. Push the repo to GitHub, import it in Vercel, and set `DATABASE_URL` and `DATABASE_AUTH_TOKEN` (see `.env.example`).
3. Tables and seed users are created on first request.

## Known limits
See ARCHITECTURE.md ("Cut on purpose" and "Next 2-4 hours").
