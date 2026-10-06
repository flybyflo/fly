---
name: deslop
description: Remove AI-generated code slop from the current branch and align it with the surrounding code style. Use for /deslop, "clean up the diff", or as the cleanup pass before review or a PR.
---

# Remove AI code slop

Check the diff against the base branch (default `main`, including the working tree) and remove AI-generated slop introduced in the branch. In Claude Code, `/simplify` is an acceptable substitute when it is available.

## Focus Areas

- Extra comments that are unnecessary or inconsistent with local style
- Defensive checks or try/catch blocks that are abnormal for trusted code paths
- Casts to `any` used only to bypass type issues
- Deeply nested code that should be simplified with early returns
- Other patterns inconsistent with the file and surrounding codebase

## Guardrails

- Keep behavior unchanged unless fixing a clear bug.
- Prefer minimal, focused edits over broad rewrites.
- Leave the edits in the working tree. Commit only when the user asks.
- Keep the final summary concise (1-3 sentences).
