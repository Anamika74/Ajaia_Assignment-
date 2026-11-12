# AI workflow note  (DRAFT: edit this so it is true to what you did)

**Tools used:** Claude (planning, code generation, review). [Add any others.]

**Where AI sped me up:** scaffolding the project, the TipTap toolbar wiring, SQL schema, docx/markdown import, test cases. [Add your own examples.]

**What I changed or rejected:** [Write specifics. For example: moved permission checks out of routes into lib/access.ts; chose libSQL over Prisma so one code path works locally and on Vercel; rejected storing editor JSON in favour of sanitised HTML.]

**How I verified:** ran `npm test`; manually walked the Alice -> Bob share flow in two browsers; tried a disallowed file type, an oversized file, a view-only PATCH via curl, and a direct URL to a document I don't have access to; checked refresh persistence and formatting. [Edit to match what you actually did.]
