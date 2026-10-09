# Prompts worth copying

Swap in the real paths, skills, and done checks. Informal wording works.

## Understand

- `/fly read <thread>. restate the underlying issue in your own words, in plain english.`
- `/fly investigate why <symptom>. give me what we know, what data you used, and your best hypotheses. don't change any code yet.`
- `use /how to understand <subsystem>. then use /why to find out why it broke recently.`
- `/recall my work on <topic> from last week, then read <issue>.`
- `/teach me why you implemented it this way and not <other way>. what did you trade off?`
- `/fly take over this branch. read the decision log, find what's done, and continue. don't redo finished work.`

## Build

- Bug: `/fly <symptom>. repro first, then fix and verify.`
- Bug in an app: `/fly repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.`
- Bug with a cheap test: `/fly repro <bug> first. if there's a cheap test path, /tdd it. then fix and rerun.`
- Feature: `/fly add <behavior>. <current output> stays byte-identical. verify both.`
- Refactor: `/fly move <code> into one module, zero behavior change. record the current output first and prove it's unchanged after.`
- Perf: `/fly <operation> takes <time> on <fixture>. trace it, fix the measured cause, show me before and after.`

## Design and plan

- `/fly prototype a few options for <feature>. take screenshots or videos for me to compare.`
- `/fly we need <feature>. frame the data shape and answer open questions with prototypes. let me review before implementation.`
- `/fly write a tutorial for how i would use <new package> first. then /teach me why it beats the current one.`
- `/fly turn this design into a plan. small verifiable PRs, each with its own verification steps.`
- `/fly plan the migration of <library> to <target>. small verifiable PRs. the result must match the original exactly, bugs included.`

## Review and ship

- `/fly review the whole branch with a check reviewer. don't change anything yet. focus on real bugs and regressions.` Read the rejected findings too.
- `/fly check every package under <dir> against its check script. use parallel verification subagents, one per package. one report.`
- `/fly open the pr. small ordered commits, evidence in the description.`
- `/fly babysit this pr. get it green.` For status only: `/fly check on pr <number>. anything outstanding?`
- `/fly land the stack.`

## Away and back

- `/fly im going to bed. <goal> in a fresh worktree off <base>. done means <checks>. keep a decision log. don't ask me before committing. /loop until done. if you're truly stuck after a few hours, stop and write up why.`
- `/show-me-your-work catch me up on what you did last night.` Read its Attention section first.
- `/fly build these changes in small verifiable units. keep a decision log. leave the branch ready for my review.`
- `/reflect capture what we learned so the next run doesn't repeat it.` Approve only edits that change a future decision.
- `/bro` restates the last reply in plain words.
