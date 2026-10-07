# fly model configuration. One line per role. Delete a line to fall back to the skill default.
# Format: role: <providerInstanceId>/<model>@<effort>, or a comma-separated list for panels.
# `inherit-parent` as a value: the role runs on the current thread's model. Alias entries in a panel list still count toward its fan-out.
# budget: large (high), codex roles raised to xhigh
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
