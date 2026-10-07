# Build the change and clean the diff

The [Build playbook](../../skills/fly/playbooks/build.md) covers every code change. Say what you observed and how you will prove the result. This page shows what to put in the prompt for each common build task, then the cleanup habit that keeps diffs reviewable.

## Prompt Build with what you know

A bug prompt states the symptom and asks for a reproduction first:

```text
/fly this command emits two records after a retry. repro first, then fix and verify.
```

A feature prompt states the behavior and what must not change:

```text
/fly add a --json flag. text output stays byte-identical. verify both forms.
```

A refactoring prompt pins behavior before structure moves:

```text
/fly move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.
```

A perf prompt states the measurement, not a vibe:

```text
/fly startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.
```

Each of these uses Build. Frame the done predicate and data shape first. Reproduce a bug on the real surface before fixing it, and measure a performance baseline with [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) before optimizing. Large work splits into units that each end in a verifiable state.

Sometimes you want the cause before any fix. Say so and give the agent the live symptom or captured profile:

```text
/fly here's a cpuprofile from the slow startup. tell me where the time goes and which source lines own it. no fix yet.
```

## Review and verify each unit

Build delegates non-UI code to `implement` and UI code to `frontend`. The `review panel` checks the diff and brief in parallel. The parent judges each finding and sends accepted blocking findings to a fresh implementation agent. The loop ends when no blocking findings remain, or stops after three rounds with the open findings reported.

The verification loop runs `/deslop` and `/react-doctor` for React changes. A `verification` agent checks the applicable `AGENTS.md` and `CLAUDE.md` rules while a `team review` agent runs the repo's review workflow. Then the agent runs the typecheck, lint, affected tests, and proof on the real surface. Accepted findings trigger another pass through the whole block, with the same three-round limit.

The report states what changed, what the loops found and fixed, what remains open, and the proof. Commit, push, and PR actions wait for explicit approval.

## Write the failing test first with `/tdd`

Nothing in fly adds a regression test on its own. When you want the fix to arrive with a failing test first, say so, and in context the whole prompt can be two words:

```text
/tdd implement
```

[`/tdd`](../../skills/tdd/SKILL.md) writes the smallest test that fails for the intended reason, then the fix, then reruns the test. If a test would need broad harness setup or brittle mocks, the skill says so and uses the closest executable check instead. Don't force a test where a real command is stronger evidence.

## Load the TypeScript rules by name

[`typescript-best-practices`](../../skills/typescript-best-practices/SKILL.md) turns the type-system principles into concrete rules: discriminated unions, `unknown` at boundaries, exhaustive variants, schema-derived types. The agent can load it from its description when a task touches `.ts` or `.tsx` files. Type `/typescript-best-practices` to make sure.

## Clean before you commit

The [Opening a PR playbook](../../skills/fly/playbooks/opening-a-pr.md) runs `/deslop` on the diff before each commit and applies [`/unslop`](../../skills/unslop/SKILL.md) to the PR description and commit bodies. `/deslop` ships with fly. In Claude Code, `/simplify` is an acceptable substitute. Either way, the outcome is the same: remove narrating comments, unsupported guards, dead compatibility paths, and unrelated edits.

For prose, `/unslop` takes a target and any extra rules you have:

```text
/unslop the readme changes, no emdashes
```

You'll develop your own shorthand. The skill reads intent fine from terse prompts like `unslop that, tighten it`.

## Strip the comments with `/no-comments`

Comments need their own pass, and not from the agent that wrote them. An author defends its comments the way you'd defend yours. So before review, hand them to fresh eyes:

```text
/no-comments the diff
```

[`/no-comments`](../../skills/no-comments/SKILL.md) spawns [Comment Sicko](../../agents/comment-sicko.md), a read-only reviewer with a short keep list: license headers, doc comments on a public API, links that explain what code can't, behavior forced by an external dependency you can't reshape. Everything else goes. A surprise in your own code gets no such pass. The comment comes back as a refactor flag, and `/no-comments` fixes the flags it accepts at the root cause. When a comment claims a constraint, "do not remove", the skill offers to encode the claim as a type, test, or lint. Either way, the comment comes out.

The division of labor is worth keeping straight. `/deslop` cleans slop out of the code, `/unslop` cleans it out of prose, and `/no-comments` hands the comments to a reviewer who didn't write them.

**Pitfall:** cleanup is not optional polish. A diff with narrating comments and defensive dead weight reads as unfinished to reviewers, and the extra code is where the next bug hides. If the diff feels padded, say `deslop it` before you commit, not after review calls it out.

Next: [Verify and ship](./06-verify-and-ship.md).
