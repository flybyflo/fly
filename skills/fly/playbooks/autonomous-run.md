### Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.**

Autonomy here covers reversible local work. Commit, push, opening or updating a PR, merge, and force-push still run only when the user's current request explicitly grants that action. Without the grant, keep driving on everything else and stop at those gates with a ready summary.

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero).
2. Pick the wake mechanism. A PR event (CI, a review, a conflict) gets T3 `watch_pull_request`. End the turn and T3 wakes you. Another event (a merge, a ref advancing, a job finishing) gets a watcher that exits on the event: a background `Bash` command or `Monitor` in Claude Code, background exec in Codex. Back it with a long time-based heartbeat from Claude Code's `/loop` or `ScheduleWakeup`, or T3 `schedule_task`. No event gets a fixed-interval heartbeat sized to when the result is worth re-checking.
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, keeps it if it advanced (as a commit when the grant covers committing), discards changes that didn't help. Belt-and-suspenders that "might help" gets reverted, not left to ride.
   Sequence the work via the **sequence-verifiable-units** principle skill, verifying each unit before the next instead of batching checks at the end.
4. Mid-run discoveries are yours. Address broken skills, related bugs, flaky verifiers, review noise, tooling failures, orphaned follow-ups, and fixable drift yourself via fly. Put out-of-band fixes on their own branch, ready for their own PR. Do not park reversible work for the human or ask a structured question about it. Surface only gated actions the request does not grant, irreversible actions, genuine product or preference calls no experiment can settle, or a real dead end. Keep the predicate as the main drive, and return to it after each side fix.
5. Checkpoint every iteration via the **show-me-your-work** skill, a row for what changed and whether the predicate moved.
6. Stop when the predicate is met. A plateau is not a stop, so keep going and pivot your approach to push past it. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory. On stop, remove any wake you armed (`unwatch_pull_request`, `delete_scheduled_task`, or stop the loop).

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state, and every gated action prepared but not taken.
