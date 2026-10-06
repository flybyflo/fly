---
name: principle-never-block-on-the-human
description: "Apply when tempted to ask 'should I do X?' on reversible local work. Proceed, present the result, let the human course-correct after the fact. The approval gates (commit, push, PR, merge, deploy, and the always-ask list) are the exceptions and stay in force."
disable-model-invocation: true
---

# Never Block on the Human

The human supervises asynchronously. Agents must stay unblocked. Make reasonable decisions, proceed, and let the human course-correct after the fact.

**Why:** Every permission pause stalls the pipeline and makes the human the bottleneck. Since local code changes are reversible and reviewable, a wrong decision usually costs less than blocking.

**Pattern:**
- **Proceed, then present.** Do the work, show the result. Don't ask "should I do X?" Do X, explain why.
- **Make the system self-healing.** When you notice a problem, log it and fix it in the next round.

**Boundaries:**
- **Reversible local work** proceeds without asking: reading, running, editing the working tree, local experiments, prototypes, subagent fan-out, drafts.
- **Product direction** comes from the human. *Execution* should not block.
- **The approval gates are not reversible work.** This principle never overrides them, and neither does "just do it", "full autonomy" or "run until done":
  - Never arm auto-merge. Merge only a PR the user names in the current request. Never push directly to `main` or `development` without the user's explicit approval for that push. No blanket grant covers either.
  - Commit, push other branches, open or update a PR, force-push a feature branch, deploy: only after the user approves that action in the current request. Approval for one PR or one push does not carry to the next. Prepare everything, run every check, then stop at the gate with a ready summary.
  - Always ask first for: Next.js proxy or middleware behaviour, `next.config.*`, authentication or authorization, new CI checks or workflows, image or video files added to version control, data deletion, customer-facing messages, anything outward-facing that publishes content.
