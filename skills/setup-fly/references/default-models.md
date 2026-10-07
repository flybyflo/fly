# fly default models

The single source for role defaults. Every skill that picks a model reads its role line from `~/.agents/fly-models.md` first and falls back to this table, saying so. Never use a Fable model. OpenAI models (provider `codex`) run at `xhigh`; Claude models stay at `high` or below unless the user asks for more in the current request.

OpenAI work runs on `codex/gpt-6.1-sol`. Frontend work and anything that explains or communicates to the user run on `claudeAgent/claude-opus-5-5`. Panels keep one Claude seat so a second model family checks the work.

```
implement: codex/gpt-6.1-sol@xhigh
frontend: claudeAgent/claude-opus-5-5@high
review panel: codex/gpt-6.1-sol@xhigh, claudeAgent/claude-opus-5-5@high
team review: claudeAgent/claude-opus-5-5@high
verification: codex/gpt-6.1-sol@xhigh
explanations and prose: claudeAgent/claude-opus-5-5@high
how explorer: codex/gpt-6.1-sol@xhigh
how explainer: claudeAgent/claude-opus-5-5@high
why investigators: codex/gpt-6.1-sol@xhigh
why synthesizer: claudeAgent/claude-opus-5-5@high
recall scanners: codex/gpt-6.1-sol@xhigh
reflect tooling: codex/gpt-6.1-sol@xhigh
reflect judgment, divergent: codex/gpt-6.1-sol@xhigh
reflect synthesizer: claudeAgent/claude-opus-5-5@high
ui driver: codex/gpt-6.1-sol@xhigh
```

Role meanings:

- `implement`: every code-writing agent in the Build playbook except UI work, including fixes from the review and verification loops.
- `frontend`: code-writing agents whose change is UI (components, styling, layout, browser-facing behaviour), and their fixes.
- `review panel`: the parallel code reviewers in Build's review loop. Keep two model families.
- `team review`: runs the repo's own review workflow (a `team-review` skill or `code-reviewer` agent) in Build's verification loop.
- `verification`: verifiers, the rules review against AGENTS.md / CLAUDE.md, live checks and evidence-gathering sub-tasks whose result goes back to the parent. Never an explainer role, even when the brief says "explain".
- `explanations and prose`: anything written for the user: explanations, summaries, docs, PR descriptions.
- `ui driver`: the worker that drives a UI for `control-ui`, using Codex's `control-chrome` (real Chrome) or `computer-use` (desktop apps).
