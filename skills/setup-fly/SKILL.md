---
name: setup-fly
description: Configure which models fly uses per role and at what reasoning effort. Detects your available models through T3 Code and writes `~/.agents/fly-models.md`, which overrides the skill defaults. Use for /setup-fly, "configure fly models", "fly budget", or changing fly's model choices.
---

# Setup fly

Write `~/.agents/fly-models.md`, the file every fly skill reads when it picks a model for a role.

## Steps

### 1. Detect available models

Call the T3 Code tool `orchestrator_capabilities`. That is the dependable source, because `delegate_task` runs from the same catalog. Keep each provider whose `canRunChildTask` is true and whose `constraints` list is empty. For each kept provider, record its `providerInstanceId`, each model `id`, and the model's reasoning option: the select option whose label is `Reasoning` or `Effort` (its `id` varies by provider, such as `effort`, `reasoningEffort`, `reasoning`, or `reasoning_effort`) with the value ids it offers. A model with no reasoning option is written without `@<effort>`.

If `orchestrator_capabilities` is not available, the thread is not running in T3 Code. Fall back to the models the host's native subagent tool accepts, and ask the user to paste any others they want with their provider instance ids. Never write a model you have not confirmed is available. The alias `inherit-parent` is always valid even though it is not a detected model.

### 2. Load current state

The default role-to-model mapping is the file shape shown in step 5 below. If `~/.agents/fly-models.md` already exists, read it and treat its `# budget` line and its role values as the current choices. Otherwise start from those defaults. A line whose role is not in step 5, such as `how critics`, is from a retired role. Drop it.

### 3. Budget, map, and confirm

**(a) Ask for a budget.** Use `AskUserQuestion` in Claude Code. In Codex, ask one short plain question with the options numbered. Offer these three options with these exact labels, and name the current budget when the file records one. With no file, say that `large` matches the skill defaults.

- `large (OpenAI xhigh, Claude high)`
- `medium (OpenAI high, Claude medium)`
- `small (OpenAI medium, Claude low)`

Claude effort above `high` is off the menu by default. Offer `unlimited (max reasoning)` only when the user explicitly asks for more in this request.

**(b) Apply it.** Build the working table from `references/default-models.md`, and on a re-run keep any role you changed by model, list, or alias (`inherit-parent`). The budget sets the effort of every entry, panel entries included: `large` sets OpenAI entries (provider `codex`) to `xhigh` and Claude entries to `high`, `medium` sets them to `high` and `medium`, `small` to `medium` and `low`, and an explicitly requested `unlimited` budget sets every entry to `max`. The ladder is `max` > `xhigh` > `high` > `medium` > `low`, with a provider's `extra-high` value standing for `xhigh`. Write the effort as the value id the model's reasoning option uses. If the model does not offer the target effort, use the highest value it offers at or below the target, else mark the role as needing a choice. `inherit-parent` does not change. So `small` turns `claudeAgent/claude-opus-5-5@high` into `claudeAgent/claude-opus-5-5@low`, and `large` keeps every default as it is.

**(c) Show the roles and confirm.** Show every role with its value, marking any entry whose provider or model is not in the detected set as needing a choice. Also list each line step 2 dropped. Ask whether to accept as-is or change specific roles, offering the detected models grouped by provider, plus `inherit-parent` (the role runs on the current thread's model). Use `AskUserQuestion` in Claude Code, a plain question in Codex. Any detected model is a valid pick, including models outside the defaults such as a Grok model the user has enabled. For panel roles (arena runners, architect runners, interrogate reviewers) the value is a list, and one subagent runs per entry, alias entries included, so the list length sets the count. Recommend mixing providers and model families on panels, since a second opinion is the same brief against a different family. `arena cross-judge pool` is also a list, but Arena selects one value from it whose model family differs from the parent's when possible. `swarm workers` is the default model for every worker unless a race or comparison assigns another model per arm.

### 4. Validate

Every entry written must name a provider kept in step 1, a model that provider lists, and an effort that model's reasoning option offers. `inherit-parent` always passes. If a chosen entry is not available, stop and ask again.

### 5. Write the file

`~/.agents/fly-models.md` is normally a link that `install.sh` points at `fly-models.md` in the fly repo. Resolve it (`readlink`) and write the file it points to, so the change lands in the repo; never replace the link with a plain file. If it is missing or already a plain file, create `~/.agents/` if needed and write it in place. Write it as plain text with no frontmatter: a `# budget` line with the chosen label and its target effort, and one line per role, using the same labels fly uses. Each line is `role: <providerInstanceId>/<model>@<effort>`, or a comma-separated list for panels. Overwrite the whole file so re-runs stay idempotent. Shape, shown with the defaults:

```
# fly model configuration. One line per role. Delete a line to fall back to the skill default.
# Format: role: <providerInstanceId>/<model>@<effort>, or a comma-separated list for panels.
# `inherit-parent` as a value: the role runs on the current thread's model. Alias entries in a panel list still count toward its fan-out.
# budget: large (OpenAI xhigh, Claude high)
feature, refactoring: codex/gpt-6.1-sol@xhigh
bug-fix: codex/gpt-6.1-sol@xhigh
perf-issue: codex/gpt-6-astra@xhigh
hillclimb: codex/gpt-6.1-sol@xhigh
frontend: claudeAgent/claude-opus-5-5@high
hardest tasks: codex/gpt-6-astra@xhigh
judgment: codex/gpt-6-astra@xhigh
verification: codex/gpt-6-astra@xhigh
explanations and prose: claudeAgent/claude-opus-5-5@high
how explorer: codex/gpt-6.1-sol@xhigh
how explainer: claudeAgent/claude-opus-5-5@high
why investigators: codex/gpt-6.1-sol@xhigh
why synthesizer: claudeAgent/claude-opus-5-5@high
recall scanners: codex/gpt-6.1-sol@xhigh
reflect tooling: codex/gpt-6.1-sol@xhigh
reflect judgment, divergent: codex/gpt-6-astra@xhigh
reflect synthesizer: claudeAgent/claude-opus-5-5@high
swarm workers: codex/gpt-6.1-sol@xhigh
ui driver: codex/gpt-6.1-sol@xhigh
arena runners: codex/gpt-6-astra@xhigh, claudeAgent/claude-opus-5-5@high
arena cross-judge pool: codex/gpt-6-astra@xhigh, claudeAgent/claude-opus-5-5@high
architect runners: codex/gpt-6-astra@xhigh, claudeAgent/claude-opus-5-5@high
interrogate reviewers: codex/gpt-6-astra@xhigh, claudeAgent/claude-opus-5-5@high
```

### 6. Confirm

Tell the user the file was written. Skills read it each time they pick a model, so it applies from the next subagent spawn in any Claude Code or Codex thread. Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke `/create-verification-skill`, which ships with fly. On no, move on without pushing.
