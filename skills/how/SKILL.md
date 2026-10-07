---
name: how
description: "Use for \"how does X work\", code walkthroughs before changing something, and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, onboarding mental models. Use why for motivation."
disable-model-invocation: true
---

# How

Explore the codebase to answer "how does X work?" questions. Produce architectural explanations at the level of a senior engineer onboarding onto a subsystem, enough to build a working mental model, not so much that it reads like annotated source code.

Each spawn below names a role line in `~/.agents/fly-models.md` and a default. An entry reads `<providerInstanceId>/<model>@<effort>`. Use that line's value. If the file or the line is missing, use the default and say so. Leave the model unset for `inherit-parent`. Effort follows the role line: OpenAI models (provider `codex`) run at `xhigh`, Claude models at `high` or below, unless the user asks for different effort in this request.

Spawn on the host's native subagent tool when the entry's provider is the current thread's provider and the tool can run that model. In Claude Code, that is `Agent` with `subagent_type: "general-purpose"` and `model` set to the family alias (`opus`, `sonnet`, `haiku`; never Fable). In Codex, it is its native subagent tool. Otherwise use T3 `delegate_task` with `role: "research"`, `target.providerInstanceId`, `target.model`, and the effort in `target.options`, all as listed by `orchestrator_capabilities`, plus `mode: "async"` and a distinct `clientRequestId` per spawn. Track each `taskId` with `task_status`. If `orchestrator_capabilities` does not list the configured model, use the default and say so. If it lacks the default too, use the closest model from the same provider and say so.

Every spawn is read-only. Its brief says it writes nothing.

If the repo ships a code-graph tool (for example a `graphify` skill, or a graph query command documented in `AGENTS.md` or `CLAUDE.md`), name it in every brief so callers, callees, and importers come from the graph before file search. Check for it first. Don't assume it exists.

## Step 1. Assess Complexity

If the scope is ambiguous, state your interpretation and explore. The user can redirect.

- **Simple** (a single module, a small utility, a narrow question such as "how does function X work"): no explorers. One explainer explores and explains in a single pass. Go to Step 2b.
- **Complex** (a subsystem spanning multiple files or services, a cross-cutting feature, a full architectural overview): spawn parallel explorers first, then hand off to the explainer. Go to Step 2a.

When in doubt, take the simple path.

## Step 2a. Explore (complex questions only)

Decompose the question into 2 to 4 exploration angles, each a distinct slice of the subsystem. Spawn all explorers in a single message:

- Role line: `how explorer`, default `codex/gpt-6.1-sol@xhigh`
- In Claude Code, `run_in_background: true`

Each explorer gets the prompt in `references/explorer-prompt.md` with its angle filled in. Then go to Step 3.

## Step 2b. Direct Explain (simple questions)

Spawn one subagent that explores and explains in one pass:

- Role line: `how explainer`, default `claudeAgent/claude-opus-5-5@high`, when the user asked the question directly. When another skill or playbook runs `how` for grounding, verification, or evidence, use the `verification` role instead (default `codex/gpt-6-astra@xhigh`): its answer goes back to the caller, not to the user.

Build its prompt from `references/explainer-prompt.md` without the explorer-findings section. Go to Step 4.

## Step 3. Synthesize (complex questions only)

Once all explorers have returned, spawn one subagent to synthesize their findings into one explanation:

- Role line: `how explainer`, default `claudeAgent/claude-opus-5-5@high`, or the `verification` role when another skill or playbook is the caller (see Step 2b).

Build its prompt from `references/explainer-prompt.md` with every explorer's findings filled in.

## Step 4. Present

Present the explainer's output to the user. Light edits for clarity or context from the conversation are fine. Do not substantially rewrite it.

## Output Format

The explanation uses the sections defined in `references/explainer-prompt.md`, dropping any that do not apply: Overview, Key Concepts, How It Works, Where Things Live, Gotchas.
