---
name: fly-help
description: Guides users through fly setup, /fly, and picking the skill, playbook, or principle for a task. Type /fly-help with a question.
disable-model-invocation: true
---

# fly help

Answer the user's question about fly, hand them a prompt they can send, and link the file the answer came from. For a help question, don't start the work. The user asked how, and a fly run spends real tokens, so let them send the prompt.

A message that asks for work, such as "use fly to fix this bug", is not a help question. Read [`fly`](../fly/SKILL.md), do the work under it, and mention once that `/fly` applies to the task it starts, so the next task needs it again.

This file maps questions to the skills and guide pages that hold the answers. Those files own the details. Read the file you route to before you quote it, and trust it when it disagrees with this map. The links here are relative to this skill. The installed skill directory is a link into the user's fly checkout, so resolve it and give the user the file's absolute path in that checkout.

## Find out what they need

Infer the need from the message and the conversation. A named situation, such as "which skill reviews a PR?", goes straight to its section. If the need is still unclear, ask one multiple-choice question (`AskUserQuestion` in Claude Code, a short numbered list in Codex) with these options, then answer only the section they pick:

- Get set up
- Start a task with `/fly`
- Pick a skill for a situation
- Fix a run that went wrong
- Make fly my own

Check the state that changes the answer, and mention it only when it does:

- No `~/.agents/fly-models.md` means `/setup-fly` hasn't run for this user, so every role uses its default model.
- No `verify-*` skill or other app harness in the project means agents have no scripted way to drive the app. Mention `/create-verification-skill` when the question is about proving a change works.

When the model file is missing and it matters, ask whether the user wants to pick a model for each role and an effort preset now. It matters when the user is new, the question is about setup or cost, or the answer depends on which models run. Ask at most once per thread. If the need is also unclear, ask both questions together. Offer two choices:

- Now: give them `/setup-fly` to type, and answer their question too.
- Later: answer their question, and add one line saying every role keeps its default model until they run `/setup-fly`.

## Get set up

1. Run [`install.sh`](../../install.sh) from the fly checkout. It links each skill into `~/.agents/skills/` (Codex) and `~/.claude/skills/` (Claude Code), and the agents into `~/.claude/agents/`.
2. Run [`/setup-fly`](../setup-fly/SKILL.md) in a T3 Code thread. It reads the models T3 Code offers, asks for an effort preset, maps a model to each role, and writes `~/.agents/fly-models.md`. Skills read that file each time they pick a model.
3. Start a real task with `/fly`, a goal, and a check that can pass or fail.

Most fly skills load when typed or when `/fly` runs them. `fly` can also load for nontrivial coding tasks, and repository instructions can require it. The [guide](../../docs/guide/README.md) and [guide page 1](../../docs/guide/01-setup.md) have the details. Offer to word their first prompt with them, per [`references/prompting.md`](references/prompting.md).

If cost is the worry, say where the tokens go and how to spend fewer. fly spends extra tokens on subagents and their review and verification loops. Rerun `/setup-fly` and pick a lower preset or cheaper models. A role set to `inherit-parent` runs on the thread's model, which saves tokens when the thread runs a cheaper model. Save `/fly` for work that needs rigor.

fly is built for T3 Code threads running Claude Code or Codex. One copy of each skill serves both hosts. Per-role models on other providers, PR watching, and scheduled runs use T3 Code's tools (`delegate_task`, `watch_pull_request`, `schedule_task`). Outside T3 Code those parts fall back to the host's native subagent tool and the thread's own model.

## Start a task with `/fly`

`/fly` uses Build for code changes and the remaining playbooks for authoring, eval, PRs, and shipping. It copies the playbook's steps into the todo list and runs the other skills as the steps need them. A step it skips stays in the list as `skip: <reason>`. A good prompt states the goal and how to tell it's done. It doesn't list skills, because a hand-written sequence tends to drop or reorder steps the playbook would keep. Read [`references/prompting.md`](references/prompting.md) before you help word one. [Guide page 2](../../docs/guide/02-fly.md) has examples.

`/fly` attaches the skill to the message that starts a task. It fades as the thread moves on, so start each new task with `/fly`. Mid-thread, "new task" makes the mode match a fresh playbook.

`/fly` already uses `fly-agent` for the subagents its playbook steps spawn in Claude Code. To get the same style from a subagent of your own, spawn it with `subagent_type: "fly-agent"`. In Codex or through `delegate_task`, tell the child to read the `fly` SKILL.md in full before any work.

`/fly` commits, pushes, and opens and updates PRs without asking. It merges, pushes straight to a base branch, or deploys only when the user asks for that, as in "land the stack". `/fly auto <task>` starts the task in auto mode, where it does those without asking too. In both modes it asks first for Next.js proxy or middleware behaviour, `next.config.*`, and outward-facing publishing, such as posts, messages, and PR comments. A user who wants a run to stay local says so in the prompt, as in "don't commit".

## Pick a skill

The default answer is `/fly`, which runs most of the others when its steps need them. Name a skill directly when the user wants more or less of something than the playbook gives. Read the skill before you recommend it, and give one example prompt.

| The user wants to | Skill |
|---|---|
| Do any non-trivial task with rigor | [`/fly`](../fly/SKILL.md) |
| Know how code works now, or where new code should live | [`/how`](../how/SKILL.md) |
| Know why code is shaped this way, or where a number came from | [`/why`](../why/SKILL.md) |
| Understand a change or subsystem, explained plainly | [`/teach`](../teach/SKILL.md) |
| Catch up on their own recent work on a topic | [`/recall`](../recall/SKILL.md) |
| Know what a small diff could break outside itself | [`/blast-radius`](../blast-radius/SKILL.md) |
| Frame, implement, review, and verify a code change | [Build](../fly/playbooks/build.md) through `/fly` |
| Write a failing end-to-end test first, for a bug or a hard change such as a migration | [`/tdd`](../tdd/SKILL.md) |
| Apply TypeScript rules to `.ts` or `.tsx` work | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| Clean AI-generated slop out of a diff before commit | [`/deslop`](../deslop/SKILL.md) |
| Strip comments before review, using a reviewer that didn't write them | [`/no-comments`](../no-comments/SKILL.md) |
| Scan React code for diagnostics before a commit | [`react-doctor`](../react-doctor/SKILL.md) |
| Get the same review from three models on three providers | [`council`](../council/SKILL.md) |
| Clean AI tells out of prose | [`/unslop`](../unslop/SKILL.md) |
| Write docs, an RFC, a README, a PR description, or a commit message to a standard | [`/technical-writing`](../technical-writing/SKILL.md) |
| Hear the last reply again in plain words | [`/bro`](../bro/SKILL.md) |
| Drive a web or Electron UI to prove a change works | [`control-ui`](../control-ui/SKILL.md) |
| Drive a CLI or TUI to prove a change works | [`control-cli`](../control-cli/SKILL.md) |
| Give agents a scripted way to drive the app and prove behavior | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| Bring a verification skill and its feature map back in line with the app | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| Vet a performance number before reporting or acting on it | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| Run a large or long code change in verifiable units | [Build](../fly/playbooks/build.md) through `/fly` |
| Keep a decision log during a run, and review it afterward | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| Pick a model for each role and an effort preset | [`/setup-fly`](../setup-fly/SKILL.md) |
| Turn their own working habits into a personal mode skill | [`/automate-me`](../automate-me/SKILL.md) |
| Turn what a finished task taught into skill edits | [`/reflect`](../reflect/SKILL.md) |
| Stop agents from repeating the same mistakes in this repo | [`/correct`](../correct/SKILL.md) |
| Find their way around fly | `/fly-help` |

If a skill directory next to this one is missing from the table, read its frontmatter and route by its description. The `principle-*` directories are covered under principles below.

Close calls:

- `/how` explains what the code does. `/why` explains the reasons. `/teach` runs one or both and explains the result plainly.
- Build's `check` reviewer reviews the diff. `/blast-radius` looks for breakage outside the diff and proves the one fact that makes the change safe.
- `/deslop` cleans code before commit. `/unslop` cleans prose. In Claude Code, `/simplify` can stand in for `/deslop`.
- `/recall` rebuilds prior context. Build frames the next verifiable unit of code work.

Not in fly:

- `/loop` is a Claude Code built-in. In T3 Code, `schedule_task` runs work on an interval, at a fixed time, or from a webhook.
- `skill-creator` is the host's built-in for writing a skill, in both Claude Code and Codex.

## Playbooks and principles

Playbooks are step lists inside `/fly`, not skills, so they have no slash command. Inside `/fly`, describing the task picks one, and these phrases name one directly:

- "babysit this pr" or "check on pr 123" runs Babysit. It drives the PR to merge-ready and stops there. It doesn't merge; name the PRs to merge, land, or ship in a separate request.
- "land the stack" runs Shipping.
- Code changes, including long tasks and migrations, run [Build](../fly/playbooks/build.md).
- "run the eval playbook" runs Eval.

Without `/fly`, a phrase such as "babysit this pr" can start another installed skill for the same job instead. The Playbooks section of [`fly`](../fly/SKILL.md) lists every playbook and when it applies. [Guide page 6](../../docs/guide/06-verify-and-ship.md) covers opening, babysitting, and landing a PR.

fly has no planning skill. The host's plan mode works alongside it. Build frames the done predicate and data shape, then splits large work into units that each end in a verifiable state. Ask for a plan or prototype explicitly when that is the deliverable.

Principles are one-rule skills that `/fly` reads and cites in its replies. The user rarely invokes one. They steer with the names instead, as in "apply prove it works. show me the real output." Typing `/principle-<name>` still loads one on demand. [Guide page 8](../../docs/guide/08-principles.md) lists them.

## Fix a run that went wrong

| Symptom | Fix |
|---|---|
| The mode stopped applying after a few turns | `/fly` fades as the thread moves on. Start each task with `/fly`. |
| A question got treated as the next step of the last task | Say "new task", or say the turn doesn't need the mode. |
| A new model choice had no effect | Skills read `~/.agents/fly-models.md` when they pick a model. Check that the role's line exists and names a model `orchestrator_capabilities` lists, or rerun `/setup-fly`. |
| Runs cost more than expected | See the cost paragraph under Get set up. |
| A skill didn't load on its own | Most fly skills load only when the user types them or when `/fly` runs them, and it doesn't run every skill. |
| The run stopped and asked before a change | It hit the ask-first list: Next.js proxy or middleware, `next.config.*`, or outward-facing publishing. Answer in a message, or pre-approve it in the next prompt. |
| The run opened a PR and didn't merge it | Normal mode waits for approval before a merge, a push straight to a base branch, or a deploy. Say "land it", or start the task with `/fly auto`. |
| Parallel agents overwrote each other | Give each agent its own git worktree: `isolation: "worktree"` on the Claude Code `Agent` tool, or a T3 thread launched with a worktree strategy. |
| An overnight run moved but finished nothing | `/loop` or a scheduled task needs a check that can pass or fail, not a duration. See [guide page 7](../../docs/guide/07-overnight.md). |
| The reply claims success from a green build | Ask for the real command, flow, stored value, or profile. That's the prove-it-works principle. |

For a run that drifts, [`references/prompting.md`](references/prompting.md) has one-line steers. [Guide page 10](../../docs/guide/10-recipes-and-pitfalls.md) has more pitfalls and the recipes worth copying.

## Make fly my own

- [`/automate-me`](../automate-me/SKILL.md) drafts a personal mode skill from the user's own history, to use alongside `/fly`.
- [`/reflect`](../reflect/SKILL.md) after a session turns its lessons into skill edits the user approves.
- `/fly write a skill for <workflow>` runs the authoring playbook with `skill-creator`. The eval playbook tests a skill change blind.
- Fix a misbehaving skill in its own change, not inside the feature work where it went wrong.

[Guide page 9](../../docs/guide/09-make-it-yours.md) covers each of these.

## Reply

Lead with the answer. Give at most one example prompt in a code block, adapted from [`references/recipes.md`](references/recipes.md) when one fits, then the link to that file. Keep it short unless the user asked for the whole map.
