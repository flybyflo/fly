---
name: deslop
description: Remove AI-generated code slop from the current branch without changing behavior, such as narrating comments, defensive code in trusted paths, type escapes, speculative abstractions and fallbacks, and scope creep. Use for /deslop, "clean up the diff", or as the cleanup pass before review or a PR. Say "deslop deep" for a whole-repo pass.
---

# Deslop

Leave the branch smaller and plainer than the agent left it: same behavior, less code.

## Scope

- Default: what the branch changed. Diff against the merge base with its real base branch (`git merge-base HEAD <base>`; infer `main` or `development`, never assume), plus staged, unstaged and untracked files.
- Edit only lines the branch added or changed. Older code stays unless the user widens the scope.
- `deep`: the whole repo, see below.

## Slop

- Comments that narrate the code or don't match the file's style. For a thorough comment pass, run `no-comments`.
- Defensive checks, try/catch, catch-and-fallback or catch-log-rethrow in trusted paths, and handling for cases that cannot happen.
- Type escapes (`any`, casts, `!`, `@ts-ignore`) added only to silence the compiler.
- Speculative structure: helpers, factories, options or layers with one caller. Three similar lines beat a premature abstraction.
- Compatibility leftovers: `_unused` renames, re-exports, `// removed` notes, old and new paths side by side, fallbacks with no current caller.
- Scope creep: refactors, docstrings or annotations on code the task didn't need to touch.
- Debug logging, stubs, placeholders, and TODOs about the work just done.
- Deep nesting that early returns flatten, nested ternaries, dense one-liners. Clarity over brevity.
- A fallback or validator that exists only because a test exercises it, and a test that exists only for it. Remove both.
- Anything else unlike the surrounding file or the repo's `AGENTS.md` / `CLAUDE.md` conventions.

## Keep

Never remove handling at a real boundary: user input, network, file I/O, parsing, auth, persistence, transactions, concurrency, external protocols, or a documented compatibility promise. Inside trusted code, let unexpected errors surface rather than hide them.

## Confidence

- **HIGH** (redundant, unreachable, proven unused, exists only to justify itself): fix it. Prove "unused" by searching for callers.
- **MEDIUM** (looks unnecessary, but a caller, contract or history is unverified): report it, don't edit.
- **LOW** (anything under Keep): leave it.

## Steps

1. Read the diff and the repo's instructions.
2. Apply the HIGH fixes as small, focused edits. No rewrites or style churn.
3. Re-read the diff: only slop removed, behavior unchanged. Fix a bug only if it is clear, and name it.
4. Run the repo's typecheck, lint and affected tests. Don't add tests.
5. Report in 1–3 sentences, then list MEDIUM findings with `file:line`.

Leave the edits in the working tree. This skill does not commit. The flow that called it does.

## Deep mode

For "deslop deep" or a whole-repo request, spawn eight parallel subagents directly on the `implement` role, resolved as `../setup-fly/references/default-models.md` says, each in its own worktree. Give each one a lane: duplication, shared types, unused code and dependencies, circular imports, weak types, defensive error handling, legacy and fallback paths, and AI slop. Workers apply the rules above, use analyzers the repo already has (for example `knip` or `madge`; install one only with approval), and change only HIGH items. Review and integrate every diff yourself, then verify as in step 4.
