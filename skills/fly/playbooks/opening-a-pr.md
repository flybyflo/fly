### Opening a PR

Use after the Build review and verification loops pass, and when other playbooks prepare a PR.

**Repo PR skills first.** Before you open or update a PR, check the repo for its own PR skills. Look in `.agents/skills/` and `.claude/skills/`, and follow any PR skill that `AGENTS.md` or `CLAUDE.md` names, such as `create-dev-prod-prs`. When one covers the PR, follow it, and its rules win wherever they differ from this playbook: branches and bases, draft or ready, titles, descriptions, steps after creation, and CI monitoring. Use this playbook only for what the repo skill leaves open. The ask-first list in the fly skill's Autonomy section still holds.

**Review first.** Work that came through Build already had the repo's review skill and the cleanup passes (`deslop`, `no-comments`, and `react-doctor` for React code) in its verification loop. Do not run them again. For a PR that did not come through Build, run the cleanup passes here first, then the repo's review skill (for example `team-review`) when the repo provides one, so the review covers the final diff. Then commit, push, and open the PR without asking.

**Worktree.** Work from a git worktree off main. Subagents get their own with `Agent` `isolation: "worktree"`. Multiple subagents on the same branch each get their own worktree, or `git fetch && git reset --hard origin/<branch>` between them. Dirty branch with unrelated work: patch out, fresh worktree, apply. Snarled worktree: reset from main, redo minimally.

**Commits.** Commit liberally. Rebase into small, ordered commits before opening PRs. Each commit is a future PR: landable, ordered to tell the story. Amend when the fix belongs in a just-made commit. New commit when separable.

**PRs.** Write every PR title, PR description, and commit body with `/technical-writing`, then apply `/unslop`. Apply every technical-writing layer except Diátaxis. Use one word for each action, keep articles, and avoid `-ing` when a plain verb works.

**Titles.** Use Conventional Commits in the form `type(scope): subject`. Use `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `perf` as the type. Use the changed area, such as `fly` or `docs`, as the scope. Keep the subject short and imperative. Name a real symbol when one carries the change. For example, `fix(fly): retarget opening-a-pr babysit trigger`. Do not add a trailing period.

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

A subagent that opens a PR first completes Build's review and verification loops. It posts the URL and returns to the parent. Babysitting starts only when the user asks for it.
