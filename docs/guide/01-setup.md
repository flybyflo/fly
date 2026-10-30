# Set up fly

In this page you install the skills, pick which models fly uses, and run your first task. Setup is a clone, one script, and a short conversation.

## Install the skills

Clone the repository and run the installer:

```sh
git clone https://github.com/flybyflo/fly ~/fly
cd ~/fly
./install.sh
```

The script links each `skills/<name>` into `~/.agents/skills/` for Codex and `~/.claude/skills/` for Claude Code, and each `agents/*.md` into `~/.claude/agents/`. One copy serves both hosts. Entries that already exist and do not point into the repo are left alone and reported. `./install.sh --uninstall` removes only the links it made.

Then start a new Claude Code or Codex thread in T3 Code. Skills load when a thread starts.

## Pick your models

Run:

```text
/setup-fly
```

[`/setup-fly`](../../skills/setup-fly/SKILL.md) detects the providers and models you have access to, asks for an effort preset, shows you each role, and asks what you want. Answer the questions. It writes `~/.agents/fly-models.md`, a small file every fly skill reads when it picks a model.

fly has six roles. By default Opus 5.5 builds, GPT-6.1-Sol checks, and Haiku 5.5 or GPT-6-Luna fetches:

- `architecture`, `design`, `implement` and `prose` run on `claudeAgent/claude-opus-5-5`. They cover planning and design decisions, UI code, other code, and text you read.
- `check` runs on `codex/gpt-6.1-sol`. It covers every review, verifier and live check, so code is always checked by a different model family than the one that wrote it.
- `search` runs on `claudeAgent/claude-haiku-5-5` in Claude Code threads and `codex/gpt-6-luna` in Codex threads. It covers file searches and other simple lookups.

Each line is `role: <providerInstanceId>/<model>@<effort>`, for example `check: codex/gpt-6.1-sol@xhigh`. `search` lists one entry per provider, and the entry on the current thread's provider wins. The preset sets the effort of every role except `search`. The default preset is `xhigh`. [`default-models.md`](../../skills/setup-fly/references/default-models.md) holds the defaults and what each role covers.

You only override what you care about. A role with no line in the file keeps the skill's default, and a skill that falls back to a default says so in its reply. To restore a default, delete that role's line. When a default changes, a file written before the change still pins the old default, so delete those role lines, or delete the file, then run `/setup-fly` again.

Set a role to `inherit-parent` and that role runs on the current thread's model instead of a named one. It is not a model slug.

## Accept the verification offer, or don't

At the end of setup, `/setup-fly` looks for a way to prove app behavior in your project, either a `verify-*` skill or an existing harness. If it finds neither, it offers once to generate one with [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md).

Say yes and it writes a project-local `verify-<app>` skill that teaches agents to drive your app the way a user does. It proves the skill works once before handing it over. Say no and setup moves on. You can run `/create-verification-skill` yourself any time. [Verify and ship](./06-verify-and-ship.md#create-a-project-verification-skill) covers it in depth.

If you're new to fly, say yes. An agent that can check its own work keeps going until the check passes. An agent that can't hands every result back to you to check by hand. Of everything in this guide, the verification skill pays off the most.

After setup, start a new thread. The model file applies to new sessions.

## Keep the cost in check

fly spends extra tokens on subagents and their review loops. That's the price of the rigor. To spend fewer:

- Rerun `/setup-fly` and pick a lower preset or cheaper models. A strong model in the main thread with cheaper, faster models in the code roles is a good split.
- Set a role to `inherit-parent` so it runs on the thread's own model.
- Save `/fly` for work that needs rigor. A small, obvious edit doesn't.

## Run your first task

Pick something real but small, and describe it the way you'd describe it to a colleague:

```text
/fly add a --json flag to this command. text output stays byte-identical. verify both.
```

Watch the todo list. Its first items are the matched playbook's steps copied in, the Build playbook for this prompt. If `/fly` skips a step, the step stays in the list with `skip: <reason>`, so you can see what it chose not to do.

From here you can type normal follow-ups. Typing `/fly` attaches the skill to one message, and it fades as the thread moves on. To keep it on, start each prompt with `/fly`, or add one line to the repository's `AGENTS.md` or `CLAUDE.md`: `Apply the fly skill to every multi-step task.` Repository instructions load on every turn in both hosts.

Next: [Route work through `/fly`](./02-fly.md).
