# AGENTS.md

Read [README.md](README.md) in full before the first change in a task. Keep AI instructions here and human documentation there. Consult relevant `docs/ADRs/` for architectural changes and `docs/design-system.md` for UI or OG work.

## Working Rules

- Preserve unrelated changes, follow nearby patterns, and keep the scope minimal.
- Resolve routine, reversible choices independently; ask when ambiguity affects correctness, scope, or irreversible actions.
- Use self-hosted, free and open-source solutions. Use direct imports (`#/*` or relative), without barrel re-exports.
- Never manually edit `src/routeTree.gen.ts`.
- Keep server function results serializable and preserve the lazy MDX component cache in `src/cms/mdx-parser.ts`.
- Keep loading boundaries inside a stable page shell. Reuse `TextSkeleton` and its existing CSS delay; check direct and client-side navigation with `e2e/layout-shift.spec.ts` when changing async layouts.
- Use regular hyphens instead of em-dashes in prose.

## Validation and Handoff

- Follow README validation requirements for code, dependencies, and deployment. Use targeted checks while iterating; report skipped or blocked checks.
- For documentation-only edits, check changed files with `npx prettier --check <files>` and `git diff --check`; no runtime tests or preview are needed.
- Format only changed files; `npm run format` rewrites the repository.
- For Playwright, explicitly set `BASE_URL` to a fresh production preview; otherwise its config can start a dev server. Use the Docker suite for Nginx and container behavior.
- After website behavior or visual changes, leave a preview running when possible and provide direct page links. Commit, push, or deploy when requested.
