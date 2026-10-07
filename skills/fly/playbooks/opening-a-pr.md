### Opening a PR

Use after the Build review and verification loops pass, and when other playbooks prepare a PR.

**Gate.** Commit, push, `gh pr create`, `gh pr edit`, `gh stack submit`, and force-push run only when the user's current request explicitly grants that exact action. Approval for one PR does not carry to the next. Without the grant, do everything below up to the first gated command, then stop with a ready summary: the branch and its base, the commit list, the drafted title and body, the verification you ran, and the exact commands that would publish it. Before opening or updating a PR, run the repo's review skill (for example `team-review`) on the branch when the repo provides one.

**Worktree.** Work from a git worktree off main. Subagents get their own with `Agent` `isolation: "worktree"`. Multiple subagents on the same branch each get their own worktree, or `git fetch && git reset --hard origin/<branch>` between them. Dirty branch with unrelated work: patch out, fresh worktree, apply. Snarled worktree: reset from main, redo minimally.

**Commits.** Commit liberally once the grant covers committing. Rebase into small, ordered commits before opening PRs. Each commit is a future PR: landable, ordered to tell the story. Amend when the fix belongs in a just-made commit. New commit when separable.

**PRs.** Run the `deslop` skill (`/deslop`, or `/simplify` in Claude Code) over the diff before commit. When the diff touches React code, run the **react-doctor** skill before each commit and push until `--scope changed` reports nothing (see the React rule in SKILL.md). Run `/no-comments` before review. Write every PR title, PR description, and commit body with `/technical-writing`, then apply `/unslop`. Apply every technical-writing layer except Diátaxis. Use one word for each action, keep articles, and avoid `-ing` when a plain verb works.

**Titles.** Use Conventional Commits in the form `type(scope): subject`. Use `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `perf` as the type. Use the changed area, such as `fly` or `fly`, as the scope. Keep the subject short and imperative. Name a real symbol when one carries the change. For example, `fix(fly): retarget opening-a-pr babysit trigger`. Do not add a trailing period.

**Descriptions.** The PR body is a briefing, not the lab notebook. A reviewer who has the diff should learn why the change exists, what it leaves out, what it could break, and how you proved it works, in under a minute. Write short, simple sentences with few identifiers. Do not write walls of text. The squash commit body is the PR body. If the body would make the squash commit longer than about 40 lines, cut the body.

Put each section under a `##` heading, not a bold lead-in, so the sections stand apart. Use these sections in order. Drop a section when it has nothing to say.

- `## Why` gives the problem and the approach in one to three short sentences. Do not list SHAs or rebase genealogy. Do not add a "based on main" preamble.
- `## What changed` has one to three short bullets. Name a real symbol or path only when it carries the change. Name both sides of a rename or retarget.
- `## Scope` always names what the PR covers and what it deliberately leaves out, for example a related follow-up or a known gap. Use one to three short items. Do not list symbols or paths, and do not write a file-by-file essay.
- `## Tradeoffs` names only rejected alternatives that a reviewer would otherwise ask about. Skip this section when there was no real choice.
- `## Blast Radius` gives one or two sentences on who or what the change touches and why that is safe or risky. If main is red, state the cost of leaving it red.
- `## Verification` has one to three bullets. Each bullet names a real run path and its outcome. For a performance change, report one primary number with its unit in `before → after` form. Link an evidence artifact for the remaining details. Do not include sample-size methodology, worker logs, or metric tables.

After these sections, attach videos or screenshots when they prove a claim. Do not paste full SHAs, worker-by-worker recitals, lever-correction essays, file-by-file checklists, or "CLEAN" verdicts. Put these details in a linked artifact. A commit body does not restate its subject.

**Forge.** Use the GitHub CLI (`gh`) for every PR operation: create, edit, view, watch, and merge. Use `gh stack` per the `gh-stack` skill for stacks. Do not require Graphite (`gt`).

**Link in T3.** Right after creating a PR, including each layer of a stack, call `link_pull_request` so T3 tracks it beside the thread. Link every existing PR you work on too.

**Size and stacks.** Prefer five narrow PRs to one large PR. A stack is a base-branch chain. The root PR targets trunk. Each child branch rebases onto its parent's exact tip and its PR targets the parent branch. Build the chain with `gh stack init <branch>` and `gh stack add <branch>`, and publish it with `gh stack submit --auto --open`. For a single child outside a tracked stack, create it with `gh pr create --base <parent-branch>` and retarget it with `gh pr edit <pr> --base <parent-branch>`. Branch from trunk only for independent work. Rebase on trunk before substantial stack work.

**Readiness.** Open every PR ready, never as a draft. With `gh pr create`, omit `--draft`. With `gh stack submit`, pass `--open`. If a PR still opens as a draft, run `gh pr ready <number>`. Run `gh pr view <number>` before you refer to PR status.

**Babysit.** Opening a PR does not start a babysit. Post the URL and keep building. Finish the phase or stack first. Run a separate babysit pass only when the user asks for one after the whole stack exists. A babysit for each new PR stalls the build and spends checks on commits that later waves restart. Push back when feedback drifts from intent.

A subagent that opens a PR first completes Build's review and verification loops and runs `/no-comments` before review. It posts the URL and returns to the parent. Babysitting starts only when the user asks for it.
