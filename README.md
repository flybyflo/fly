# fly

A personal agent skill stack for T3 Code. One copy of each skill serves both Claude Code and Codex threads.

> [!WARNING]
> fly lets the agent commit, push and force-push to its working branch, and open PRs without asking you. `/fly auto` goes further: the agent also merges, turns on auto-merge, pushes to `main`, and deploys without asking. In both modes it asks first before it publishes content, such as posts, messages, and PR comments, and before it changes Next.js proxy, middleware, or `next.config.*`. To change the gates, edit the Autonomy section of `skills/fly/SKILL.md` before you install. Its gates override the playbooks.

## Install

```bash
./install.sh              # link skills into ~/.agents/skills and ~/.claude/skills, agents into ~/.claude/agents
./install.sh --uninstall  # remove only the links this repo created
```

Existing entries that don't point at this repo are skipped and reported. Start a new thread, then run `/setup-fly` to pick models per role. The choices land in `fly-models.md` in this repo, which `install.sh` links to `~/.agents/fly-models.md`.

## Start here

- `/fly <task>`: the working style. Uses Build for code changes and the authoring, eval, babysit, shipping, and opening-a-PR playbooks for their tasks. Applies the principles. It opens PRs and waits for you before it merges or deploys.
- `/fly auto <task>`: the same working style in auto mode. It also merges and deploys without asking.
- `/fly-help <question>`: which skill, playbook or principle fits a task.
- `docs/guide/`: the long-form guide.

## Skills

| Group | Skills |
|---|---|
| Mode and setup | `fly`, `fly-help`, `setup-fly`, `automate-me` |
| Understand | `how`, `why`, `teach`, `recall`, `blast-radius`, `bro` |
| Review and cleanup | `no-comments`, `deslop`, `react-doctor`, `benchmark-checklist`, `council` |
| Verify | `control-ui`, `control-cli`, `create-verification-skill`, `maintain-verification-skill`, `tdd` |
| Long-running work | `show-me-your-work`, `correct`, `reflect` |
| Writing | `unslop`, `technical-writing`, `typescript-best-practices` |
| Principles | `principle-*` (24) |

Agents: `fly-agent` (routing target for fly subagents) and `comment-sicko` (used by `no-comments`).

## Rules

`CONVENTIONS.md` is the spec every skill follows: host tool mapping for Claude Code, Codex and T3, the model config format and defaults, and the approval gates. Commits, pushes and PRs need no approval. Merges, pushes straight to a base branch, and deploys need approval unless the task started with `/fly auto`. In both modes the agent asks first for Next.js proxy or middleware behaviour, `next.config.*`, and outward-facing publishing.

## Credits

Both agents, the principles, and most skills come from Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack). `deslop`, `control-ui`, and `control-cli` come from Cursor's [cursor-team-kit](https://github.com/cursor/plugins/tree/main/cursor-team-kit). `react-doctor` comes from Million Software's [react-doctor](https://github.com/millionco/react-doctor). fly adapts them for Claude Code and Codex in T3 Code. `council` comes unchanged from Theo Browne's [tstack](https://github.com/t3dotgg/tstack).

## License

fly is MIT licensed. The exception is `skills/react-doctor`, which keeps Million Software's modified MIT license. That license requires written permission to use the skill as AI training or evaluation data, or to sell it as a hosted product. `LICENSE` has the full text of every notice.
