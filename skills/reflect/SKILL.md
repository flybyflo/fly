---
name: reflect
description: Spawn three parallel review subagents over the active transcript, surface learnings, and route each to a concrete edit on an existing skill. Use when the user says reflect.
disable-model-invocation: true
---

# Reflect

Mine the current conversation for durable learnings, then route them into skill edits.

## When to invoke

Invoke when the user says "reflect" or "/reflect". Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## Process

### 1. Locate the active transcript

The parent finds its own transcript before fanning out. Reviewers need a pointer they can read on their own, not the parent's context.

Inside T3 Code, the current thread is the transcript. Pass its thread id and tell reviewers to read it with `t3_thread_read` (`view: "activity"` to see tool calls, `view: "messages"` for the conversation, paged with `afterPosition`). The thread id is in the system prompt or context handoff; if it is not, `t3_thread_list` (newest first) shows it.

Otherwise pass the host's transcript file:

- Claude Code: `~/.claude/projects/<slug>/<session>.jsonl`, where `<slug>` is the workspace's absolute path with every `/` and `.` turned into `-`. Subagent transcripts sit under `<session>/subagents/`.
- Codex: `~/.codex/sessions/<yyyy>/<mm>/<dd>/rollout-*.jsonl`, whose first `session_meta` line names the `cwd`.

```bash
ls -t <transcript-dir>/*.jsonl 2>/dev/null | head -10
```

For each candidate, read its first `user` record and check that it holds this conversation's opening prompt. Take the matching path. Stay inside the active workspace; do not glob across other projects' transcripts. If no path resolves, write a tight digest of the session and pass that instead.

### 2. Spawn three reviewers in parallel

One message, three subagent calls. Reviewers need MCP access for context lookups (tickets, chat threads, observability traces referenced in the transcript), so do not use a read-only agent type.

Each reviewer and the synthesizer name a role line in `~/.agents/fly-models.md` (`role: <providerInstanceId>/<model>@<effort>`) and a default. Use that line's value, or the default if the file or the line is missing, and say so. Effort follows the role line: OpenAI models (provider `codex`) run at `xhigh`, Claude models at `high` or below, unless the user asks for different effort in this request. Pick the tool from the value:

- `inherit-parent`: the host's native subagent tool with no model set (`Agent` in Claude Code, Codex's native subagent tool if present, else `delegate_task`).
- The parent's own provider, and the native tool can run that model: the native tool (`Agent` with `model` set to the family, for example `opus`; never Fable).
- Anything else: `delegate_task` with `providerInstanceId` and `model` as listed by `orchestrator_capabilities`, effort via the model options it advertises. Track each by `taskId` with `task_status`.

| Lens | Role line | Default | Prompt template |
|---|---|---|---|
| Judgment | `reflect judgment, divergent` | `codex/gpt-6-astra@xhigh` | `references/judgment-reviewer.md` |
| Tooling | `reflect tooling` | `codex/gpt-6.1-sol@xhigh` | `references/tooling-reviewer.md` |
| Divergent | `reflect judgment, divergent` | `codex/gpt-6-astra@xhigh` | `references/divergent-reviewer.md` |

Pass each template verbatim, substituting the transcript pointer (thread id, file path, or digest) where marked. Reviewers return findings in their response body.

### 3. Synthesize

One subagent call, model from the `reflect synthesizer` line (default `claudeAgent/claude-opus-5-5@high`), with MCP access: the synthesizer's quality check includes spot-verifying citations. Use `references/synthesizer.md` verbatim, with each reviewer's full output inlined where marked. The synthesizer returns a structured Accepted / Rejected / Backlog list.

### 4. Structural enforcement check

Sanity-check the synthesizer's Accepted list. For any item that would be enforced more reliably by a lint rule, script, metadata flag, or runtime check, move it from Accepted to Backlog. See the **encode-lessons-in-structure** principle skill. A proposed mechanism never uses regex for validation or content checks; typed parsers, schema libraries, or structural checks only.

### 5. Apply

Before applying any Accepted edit, present the synthesizer's full Accepted/Rejected/Backlog output to the user and wait for explicit approval (`AskUserQuestion` in Claude Code, a short plain question in Codex). The user picks which subset to apply and may redirect routings. Skill changes affect every future agent. Do not auto-apply.

Backlog items are listed in the same reply. File them to the team's devex or backlog tracker only when the user approves that in the current request; filing is outward-facing.

Edits land at the skill's source. fly skills are symlinked into `~/.claude/skills/` and `~/.agents/skills/` from the fly repo, so resolve the link (`readlink -f`) and edit the file it points to, never a copy. A project-local skill (`.claude/skills/`, `.agents/skills/`) is edited in place. Skill edits are working-tree edits; committing them follows the approval gates.

For each approved Accepted item, follow the Routing field exactly:

- Trivial existing-skill edit (a one-line bullet, a tightened sentence, a stale fact corrected): parent does directly.
- Substantive existing-skill edit (a new section, a new pattern table, more than ~10 lines): hand to the `skill-creator` skill and run its draft / test / iterate loop.
- `tune description: <skill path>` (the skill exists but didn't trigger when it should have): hand to `skill-creator` and run its description-optimization loop.
- `new skill via skill-creator: <kebab-name>`: hand creation to `skill-creator`. Do not invent the shape ad hoc.

If your environment ships a SKILL.md validator, run it on every touched skill before declaring done. Skip this step if it doesn't.

### 6. Summarize for the user

Short list, no preamble:

- Edits applied: `<skill path>`. What changed, one line each.
- New skills created: `<skill path>`. One line each (rare).
- Backlog: `<item title>` (`<tags>`), filed or awaiting approval. One line each.
- Dropped: one line per rejected finding + reason from the synthesizer.
