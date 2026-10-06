# fly default models

The single source for role defaults. Every skill that picks a model reads its role line from `~/.agents/fly-models.md` first and falls back to this table, saying so. Never use a Fable model. OpenAI models (provider `codex`) run at `xhigh`; Claude models stay at `high` or below unless the user asks for more in the current request.

Tiers: normal work runs on `codex/gpt-6.1-sol`, tricky work on `codex/gpt-6-astra`, frontend work and anything that explains or communicates to the user on `claudeAgent/claude-opus-5-5`. Panels keep one Claude seat so a second model family checks the work.

```
feature, refactoring: codex/gpt-6.1-sol@xhigh
bug-fix: codex/gpt-6.1-sol@xhigh
perf-issue: codex/gpt-6-astra@xhigh
hillclimb: codex/gpt-6.1-sol@xhigh
frontend: claudeAgent/claude-opus-5-5@high
hardest tasks: codex/gpt-6-astra@xhigh
judgment: codex/gpt-6-astra@xhigh
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

Role meanings:

- `frontend`: any code delegate whose change is UI (components, styling, layout, browser-facing behaviour). It takes precedence over the playbook's line and over `hardest tasks`.
- `hardest tasks`: cross-cutting design, gnarly concurrency, subtle algorithms, outside frontend.
- `ui driver`: the worker that drives a UI for `control-ui`, using Codex's `control-chrome` (real Chrome) or `computer-use` (desktop apps).
- `judgment`: plans, reviews and decisions that the user does not read directly.
- `explanations and prose`: anything written for the user: explanations, summaries, docs, PR descriptions.
