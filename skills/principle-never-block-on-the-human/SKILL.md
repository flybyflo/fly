---
name: principle-never-block-on-the-human
description: "Apply when tempted to ask 'should I do X?' on reversible local work. Proceed, present the result, let the human course-correct after the fact. The ask-first list (Next.js proxy or middleware, `next.config.*`, outward-facing publishing) is the exception and stays in force, and so does the normal-mode gate on merges and deploys."
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
- **Commits, pushes, and PRs** proceed without asking too. Report each one.
- **Merges, auto-merge, pushes straight to a base branch, and deploys** proceed without asking only in auto mode (`/fly auto`), or when the request names them. In normal mode, leave the PR merge-ready and ask.
- **Product direction** comes from the human. *Execution* should not block.
- **Always ask first** for Next.js proxy or middleware behaviour, `next.config.*`, and anything outward-facing that publishes content, such as posts, chat or email messages, review replies, PR or issue comments, releases, and public docs. This principle never overrides that list or the normal-mode gate, and neither does "just do it", "full autonomy" or "run until done".
