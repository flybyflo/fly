# fly

A personal agent skill stack for T3 Code. One copy of each skill serves both Claude Code and Codex threads.

## Install

```bash
./install.sh              # link skills into ~/.agents/skills and ~/.claude/skills, agents into ~/.claude/agents
./install.sh --uninstall  # remove only the links this repo created
```

Existing entries that don't point at this repo are skipped and reported. Start a new thread, then run `/setup-fly` to pick models per role. The choices land in `fly-models.md` in this repo, which `install.sh` links to `~/.agents/fly-models.md`.

## Start here

- `/fly <task>`: the working style. Uses Build for code changes and the authoring, eval, babysit, shipping, and opening-a-PR playbooks for their tasks. Applies the principles.
- `/fly-help <question>`: which skill, playbook or principle fits a task.
- `docs/guide/`: the long-form guide.

## Skills

| Group | Skills |
|---|---|
| Mode and setup | `fly`, `fly-help`, `setup-fly`, `automate-me` |
| Understand | `how`, `why`, `teach`, `recall`, `blast-radius`, `bro` |
| Review and cleanup | `no-comments`, `deslop`, `react-doctor`, `benchmark-checklist` |
| Verify | `control-ui`, `control-cli`, `create-verification-skill`, `maintain-verification-skill`, `tdd` |
| Long-running work | `show-me-your-work`, `correct`, `reflect` |
| Writing | `unslop`, `technical-writing`, `typescript-best-practices` |
| Principles | `principle-*` (24) |

Agents: `fly-agent` (routing target for fly subagents) and `comment-sicko` (used by `no-comments`).

## Rules

`CONVENTIONS.md` is the spec every skill follows: host tool mapping for Claude Code, Codex and T3, the model config format and defaults, and the approval gates. Commits, pushes, PRs, merges and deploys need no approval. The agent asks first only for Next.js proxy or middleware behaviour, `next.config.*`, and outward-facing publishing.

## License

MIT. See `LICENSE` for the original copyright notices this stack is derived from.
