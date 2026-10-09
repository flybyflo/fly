# fly model configuration. One line per role. Delete a line to fall back to the skill default.
# Format: role: <providerInstanceId>/<model>@<effort>. `search` lists one entry per provider; the current thread's provider wins.
# `inherit-parent` as a value: the role runs on the current thread's model.
# preset: xhigh
architecture: claudeAgent/claude-opus-5-5@xhigh
design: claudeAgent/claude-opus-5-5@xhigh
implement: claudeAgent/claude-opus-5-5@xhigh
check: codex/gpt-6.1-sol@xhigh
prose: claudeAgent/claude-opus-5-5@xhigh
search: claudeAgent/claude-haiku-5-5@medium, codex/gpt-6-luna@medium
