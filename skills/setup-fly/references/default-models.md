# fly models

The single source for fly's roles, their defaults, and how a role turns into a subagent. Skills name a role and point here. They don't restate these rules.

Opus handles architecture, design, and implementation. Fable handles prose. Sol is the default for `check` and `search`, so review and implementation use different model families by default. Use Fable only for `prose`. The `council` skill picks its own models.

```
architecture: claudeAgent/claude-opus-5-5@xhigh
design: claudeAgent/claude-opus-5-5@xhigh
implement: claudeAgent/claude-opus-5-5@xhigh
check: codex/gpt-6.2-sol@xhigh
prose: claudeAgent/claude-fable-5-2@xhigh
search: codex/gpt-6.2-sol@medium
```

## Roles

- `architecture`: Build's Frame step (done predicate, data shape, splitting work into units), system, API, type and data-model design, and comparing prototypes for a novel design.
- `design`: UI code and visual or interaction design. Components, styling, layout, browser-facing behaviour, and their fixes.
- `implement`: every other code-writing agent, including fixes from the review and verification loops.
- `check`: anything that double-checks. Code review, rules review, the repo's team review, verifiers, live checks, UI driving for proof, eval judges, `why` investigators, `reflect` reviewers, and evidence-gathering sub-tasks whose result goes back to the parent. A sub-task whose result comes back to the parent is never `prose`, even when its brief says "explain".
- `prose`: text the user reads directly. Explanations, summaries, docs, PR descriptions, and the final answer of `how`, `why` and `reflect`.
- `search`: simple read-only lookups. Find files, grep, map where code lives, read chat transcripts, `how` explorers, `recall` scanners. It returns what it found and gives no verdicts. Anything that judges correctness goes to `check`.

## Opt in to Astra for a check

When the user explicitly asks for Astra on a `check` in the current task, use `codex/gpt-6.2-astra` for the requested review. Use `xhigh` unless the user requests a different effort. Keep the choice only in the current task context. For example, the user can say "Use Astra for the final review."

## Resolve a role

1. Apply the Astra opt-in first when it covers this `check`. Otherwise, read the role's line in `~/.agents/fly-models.md`. If the file or line is missing, or the line selects an Astra model, use the role's default and say so.
2. A line is `role: <providerInstanceId>/<model>@<effort>`. Run at that effort. `search` lists one entry per provider: use the entry on the current thread's provider, else the first one.
3. `inherit-parent` runs the role on the current thread's model. Omit `model` on `Agent`, or omit `target` on `delegate_task`.
4. If the entry's provider is the current thread's provider and the host's native subagent tool can run that model at that effort, use the native tool. In Claude Code that is `Agent` with `model` set to the family alias (`opus`, `fable`, `haiku`), and `subagent_type: "Explore"` for `search`. In Codex it is its native subagent tool.
5. Otherwise use T3 `delegate_task` with `target.providerInstanceId`, `target.model` and the effort option, all as listed by `orchestrator_capabilities`, plus `mode: "async"` and a distinct `clientRequestId` per spawn. A read-only spawn, such as an explorer, an investigator, or a source reader, also passes `role: "research"`. That is a `delegate_task` parameter, not a seventh fly role. Track each `taskId` with `task_status`.
6. If the requested Astra model or effort is unavailable, report that the Astra review is unavailable. For saved choices, if `orchestrator_capabilities` does not list the model, use the default and say so. If it lacks the default too, use the closest model from the same provider and say so.
