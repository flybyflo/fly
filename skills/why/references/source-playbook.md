# Source playbooks

The why skill spawns one investigator per available evidence category. Only source control has a bundled playbook. An investigator for any other category works from the base prompt in `investigator-prompt.md` and from its MCP's own tool descriptions.

| Category | Playbook |
|---|---|
| Source control history | [`code-archaeology.md`](./sources/code-archaeology.md), for git and `gh` |
| Issue / ticket tracker | None bundled |
| Long-form documents | None bundled |
| Real-time team chat | None bundled |
| Infrastructure observability | None bundled |
| Error / exception tracking | None bundled |
| Product analytics warehouse | None bundled |

Cross-cutting:

- [`incident-postmortem.md`](./sources/incident-postmortem.md). Add this if the target code looks defensive (null checks, retry, timeout, rate limit, feature flag, egress guard, OOM handler).
