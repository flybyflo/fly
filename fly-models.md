# fly model configuration. One line per role. Delete a line to fall back to the skill default.
# Format: role: <providerInstanceId>/<model>@<effort>, or a comma-separated list for panels.
# `inherit-parent` as a value: the role runs on the current thread's model. Alias entries in a panel list still count toward its fan-out.
# budget: large (high), codex roles raised to xhigh
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
