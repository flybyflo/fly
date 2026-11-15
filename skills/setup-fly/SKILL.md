---
name: setup-fly
description: Configure which models fly uses per role and at what reasoning effort. Detects your available models through T3 Code and writes `~/.agents/fly-models.md`, which overrides the skill defaults. Use for /setup-fly, "configure fly models", "fly preset", or changing fly's model choices.
---

# Setup fly

Write `~/.agents/fly-models.md`, the file every fly skill reads when it picks a model for a role. The roles, their defaults and their meanings live in `references/default-models.md`.

## Steps

### 1. Detect available models

Call the T3 Code tool `orchestrator_capabilities`. That is the dependable source, because `delegate_task` runs from the same catalog. Keep each provider whose `canRunChildTask` is true and whose `constraints` list is empty. For each kept provider, record its `providerInstanceId`, each model `id`, and the model's reasoning option: the select option whose label is `Reasoning` or `Effort` (its `id` varies by provider, such as `effort`, `reasoningEffort`, `reasoning`, or `reasoning_effort`) with the value ids it offers. A model with no reasoning option is written without `@<effort>`. Drop every Astra model, and offer Fable models only for `prose`.

If `orchestrator_capabilities` is not available, the thread is not running in T3 Code. Fall back to the models the host's native subagent tool accepts, and ask the user to paste any others they want with their provider instance ids. Never write a model you have not confirmed is available. The alias `inherit-parent` is always valid even though it is not a detected model.

### 2. Load current state

If `~/.agents/fly-models.md` already exists, read it and treat its `# preset` line and its role values as the current choices. A role with no line is on its default. Otherwise start from the defaults. A line whose role is not in the defaults, such as `review panel` or `how explorer`, is from a retired role. Drop it.

### 3. Preset, map, and confirm

**(a) Ask for a preset.** Use `AskUserQuestion` in Claude Code. In Codex, ask one short plain question with the options numbered. Offer `xhigh` (the default), `high` and `medium`, and name the current preset when the file records one. Offer `max` only when the user asks for more in this request.

**(b) Apply it.** The preset sets the effort of every role except `search`, which keeps its own effort. Keep any role the user changed by model or alias on a re-run. If a model does not offer the preset's effort, use the highest value it offers below it, else mark the role as needing a choice. `inherit-parent` does not change.

**(c) Show the roles and confirm.** Show every role with its value and its one-line meaning, marking any entry whose provider or model is not in the detected set as needing a choice. Also list each line step 2 dropped. Ask whether to accept as-is or change specific roles, offering the detected models grouped by provider, plus `inherit-parent`. Use `AskUserQuestion` in Claude Code, a plain question in Codex. `search` takes one entry per provider.

### 4. Validate

Every entry written must name a provider kept in step 1, a model that provider lists, and an effort that model's reasoning option offers. `inherit-parent` always passes. If a chosen entry is not available, stop and ask again.

### 5. Write the file

`~/.agents/fly-models.md` is normally a link that `install.sh` points at `fly-models.md` in the fly repo. Resolve it (`readlink`) and write the file it points to, so the change lands in the repo; never replace the link with a plain file. If it is missing or already a plain file, create `~/.agents/` if needed and write it in place. Write plain text with no frontmatter: this header, then one line for each role whose value differs from its default, in the order of the defaults table. A role that matches its default gets no line, so a later change to the default still reaches it. Overwrite the whole file so re-runs stay idempotent.

```
# fly model configuration. One line per role. A role with no line uses the skill default.
# Format: role: <providerInstanceId>/<model>@<effort>. `search` lists one entry per provider; the current thread's provider wins.
# `inherit-parent` as a value: the role runs on the current thread's model.
# preset: <preset>
```

### 6. Confirm

Tell the user the file was written. Skills read it each time they pick a model, so it applies from the next subagent spawn in any Claude Code or Codex thread. Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke `/create-verification-skill`, which ships with fly. On no, move on without pushing.
