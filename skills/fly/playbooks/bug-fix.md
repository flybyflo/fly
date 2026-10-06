### Bug fix

**You own this task. Plan, review, verify.** Delegate investigation and the fix to subagents, stay in the lead.

Be scientific. Every shipped line traces to runtime evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix. It does not ship. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships, nothing more.

1. Reproduce it yourself on the matching surface via the control skill (Non-negotiables), even when a debug or instrumentation protocol says to ask the user to reproduce. A UI follows the **control-ui** skill's driver order (a `gpt-6.1-sol` worker driving the user's real Chrome or Computer Use first), not a headless browser. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. If it won't reproduce directly, synthesize the trigger, tighten conditions, or instrument until it fires.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Seed them with `how` over the affected subsystem and the **why** skill for regression history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess. Drive a long or stubborn hunt with `/loop` in Claude Code or `schedule_task` in T3 Code. Confirm the surviving *mechanism* with runtime evidence before the step-3 architect/interrogate fan-out.
3. Plan the fix. If it crosses a function boundary, `architect` first. Delegate implementation to a subagent per the Subagents section on the `bug-fix` role from `~/.agents/fly-models.md` (default `codex/gpt-6.1-sol@xhigh`, `frontend` for UI bugs, and say so when the line is missing) with a specific scope.
4. Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
5. Keep the proof in the order it happened. The repro fails before the fix and passes after it, on the real surface. Write a test only when the user asks for one in the current request or the repo's own rules require it. Then follow the **tdd** skill's failing-test-first cadence and order the commits so the failing test lands before the fix.
   This is the canonical **sequence-verifiable-units** principle skill, the proof first and the fix on top. Commits wait for the user's explicit approval of that action in the current request (Approval gates). Without it, leave the diff in the working tree and stop with a ready summary.
6. Run **Opening a PR**.

**Reply:** what was broken, root cause, fix, how you verified. Paste failing-then-passing repro output verbatim.
