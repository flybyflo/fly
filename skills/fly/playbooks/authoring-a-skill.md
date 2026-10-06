### Authoring or modifying a skill

**You own the skill's voice.**

1. Use the **skill-creator** skill (the `.system` skill in Codex) to write or edit the `SKILL.md`. A skill lives in this repo under `skills/<name>/` and reaches both hosts through the install script, which links it into `~/.agents/skills/` (Codex) and `~/.claude/skills/` (Claude Code). Write host-neutral steps per `CONVENTIONS.md`. Where a host tool is needed, name the Claude Code tool and the Codex fallback together.
2. Validate the skill: the directory name is lowercase-hyphen and matches `name`, frontmatter has only `name`, `description` and an optional `disable-model-invocation: true`, referenced files exist and resolve relative to the skill's own `SKILL.md`, cross-skill links resolve by skill name.
3. Test cases if structural. Skip if subjective.
4. Run **Opening a PR**.

When in doubt, delete. Keep only prose that changes a decision. Tell it to do the thing and skip the reason. Explain only when the rule is confusing without one. Match tone to scope. Point at structural sources (types, READMEs, config) per the **encode-lessons-in-structure** principle skill. Delegate to other skills by name. Don't restate. A workflow you keep hitting but isn't captured → propose a new skill.

**Reply:** summary of the skill, key design decisions, validation notes.
