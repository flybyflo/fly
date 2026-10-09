# fly conventions

fly is a personal agent skill stack. It runs inside T3 Code, where every thread is either Claude Code or Codex. One copy of each skill serves both: the install script links `skills/<name>` into `~/.agents/skills/` (Codex) and `~/.claude/skills/` (Claude Code), and `agents/*.md` into `~/.claude/agents/`.

Every skill in this repo follows the rules below. When a rule and a skill disagree, fix the skill.

## Identity

- The stack is `fly`. The mode skill is `fly`, its help skill is `fly-help`, its routing subagent is `fly-agent`, and its model setup skill is `setup-fly`.
- No references to pstack, poteto, Lauren Tan, Cursor, Cursor plugins, Bugbot, Composer, Grok-by-default or `cursor-team-kit` remain in skill text. The only attribution lives in `LICENSE`.
- Skill names are lowercase-hyphen and match their directory. Frontmatter keys are limited to `name`, `description` and, where the skill should only run when the user invokes it, `disable-model-invocation: true`. Drop Cursor-only keys (`mode`, `icon`, `color`, `reminder`, `alwaysApply`, `is_background`).
- Skills refer to each other by name (`the how skill`, `/how`). They never assume an install path; a skill locates its own bundled files relative to its own `SKILL.md`.
- Most skills set `disable-model-invocation: true`, which stops Claude Code's Skill tool from loading them (Codex ignores the key). `fly` itself does not: the model may start it for any nontrivial coding task, and the global AGENTS.md/CLAUDE.md tells it to. A skill that uses another fly skill reads `../<name>/SKILL.md` beside its own directory; `fly`, `fly-agent`, `teach` and `comment-sicko` say so explicitly.

## Hosts

Write host-neutral instructions. Where a host-specific tool is needed, name the Claude Code tool and the Codex fallback together, then the T3 tool when T3 offers something better.

| Need | Claude Code | Codex | T3 Code (both hosts) |
|---|---|---|---|
| Same-provider subagent | `Agent` tool (`subagent_type`, `model`, `run_in_background`, `isolation: "worktree"`) | its native subagent tool if present, else `delegate_task` | — |
| Subagent on another provider or a specific model/effort | — | — | `delegate_task` with `providerInstanceId` + `model` from `orchestrator_capabilities`; track by `taskId` with `task_status` / `task_cancel` |
| Background shell work | `Bash` `run_in_background` / `Monitor` | background exec | — |
| Structured question to the user | `AskUserQuestion` | a short plain question in the reply | — |
| Todo list / phase tracking | `TodoWrite` / task tools | `update_plan` | — |
| Separate top-level thread in its own worktree | — | — | `t3_thread_launch` with `workspaceStrategy` |
| Recurring or triggered work | `/loop`, `ScheduleWakeup` | — | `schedule_task` (interval, fixed time, webhook) |
| Watch a PR until checks or reviews change | — | — | `watch_pull_request` / `unwatch_pull_request`; `link_pull_request` for every PR created or worked on |
| Past chats | `~/.claude/projects/<slug>/*.jsonl` | `~/.codex/sessions/**/*.jsonl` | `t3_thread_search`, `t3_thread_read`, `t3_thread_list` (preferred: covers both) |
| Drive a web or desktop UI | fallback: Claude in Chrome (`mcp__claude-in-chrome__*`) | preferred: a Codex `check` worker using `control-chrome` (real Chrome) or `computer-use` (desktop apps) | `delegate_task` to start that worker; `preview_*` tools as fallback. Order lives in `control-ui` |
| Write or improve a skill | `skill-creator` | `skill-creator` (`.system`) | — |
| Multi-agent orchestration script | `Workflow` tool, only when the user opts in | — | — |

There are no cloud workers. Isolation means a git worktree (`isolation: "worktree"` on `Agent`, or `t3_thread_launch` with a worktree strategy). A brief that needs a non-default base names the branch and commit.

## Models

- fly has six roles: `architecture`, `design`, `implement`, `check`, `prose`, `search`. Opus 5.5 builds, GPT-6.1-Sol checks, Haiku 5.5 or GPT-6-Luna fetches. Never use a Fable or Astra model.
- The roles, their defaults, and how a role resolves to a model and a tool live once, in `skills/setup-fly/references/default-models.md`. Skills name a role and point there. They never repeat a model id or the resolution rules.
- The user's choices live in `~/.agents/fly-models.md`, written by `setup-fly`. It is a link to `fly-models.md` in this repo, so the choices are versioned.

## Approval gates (non-negotiable)

These override any autonomy wording in a skill or playbook, including "never block", "just do it", "full autonomy" and "run until done".

- **Never arm auto-merge.** No `gh pr merge --auto`, no merge-queue enqueue, and no auto-merge in any other form, even when asked to "merge when ready". For a PR the user named, watch it and run the merge yourself once it is mergeable.
- **Merge a PR** only when the user names it in the current request ("merge #123", "land #12 through #15", "land this stack") and it is merge-ready when you run the merge. A standing or blanket grant ("owners may merge after a clean verdict", "full autonomy", a brief or `preferences.md` line) never covers a merge.
- **Never push directly to `main` or `development`**, force-push included, unless the user explicitly approves that push to that branch in the current request. Blanket grants never cover it. Work goes on a feature branch and reaches `main` or `development` through a PR the user merges or names for merging.
- **Commit, push other branches, open or update a PR, force-push a feature branch, deploy:** only after the user explicitly approves that action in the current request. Approval for one PR or one push does not carry to the next. Build and shipping flows prepare everything, run every check, then stop at the gate with a ready summary unless the current request already grants that exact action.
- **Always ask first** for: Next.js proxy/middleware behaviour, `next.config.*`, authentication or authorization, new CI checks or workflows, image or video files added to version control, data deletion, customer-facing messages, anything outward-facing that publishes content.
- **Proceed without asking** on reversible local work: reading, running, editing the working tree, local experiments, prototypes, subagent fan-out, drafts.
- Branches stay clean and based on their intended base (usually `main`). Never merge unrelated branches in to resolve conflicts.
- PRs are created with `gh`. Run the repo's review skill (for example `team-review`) on the branch before opening or updating a PR when the repo provides one.

## Repo rules that skills must respect

- Tests: don't add regression tests unless the user asks for one in the current request. Behaviour tests for new code follow the repo's own rules.
- No regex for validation or content checks in code a skill writes; use typed parsers, schema libraries or structural checks. Shell `grep`/`rg` for searching is fine.
- Repository instructions (`AGENTS.md`, `CLAUDE.md`) outrank skills. A skill never tells the agent to ignore them.

## Cross-skill dependencies

- Code cleanup before review: the `deslop` skill (bundled here). In Claude Code, `/simplify` is an acceptable substitute.
- Driving the product to prove a change: `control-ui` (web, Electron) and `control-cli` (CLIs, TUIs), both bundled here, or a project-local `verify-*` skill made by `create-verification-skill`.
- Automated PR reviewers: whatever bots the repo runs (for example Codex review, Copilot, Claude review). Triage their comments with `skills/fly/references/review-bot-triage.md`.
- Skill authoring: `skill-creator`, plus the authoring-a-skill playbook in `fly`.

## Writing

Skill prose follows `unslop` and `technical-writing`: short declarative sentences, no filler, no hype, imperative steps. Keep each skill's existing structure and intent; change only what the host, identity or approval rules require, plus anything that no longer makes sense outside Cursor.
