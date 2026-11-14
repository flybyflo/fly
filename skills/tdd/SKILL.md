---
name: tdd
description: "Use when the user explicitly asks for TDD, a failing test, or a regression test in the current request, or when the change is a hard problem such as a database migration that needs an end-to-end test first. Never start it for an ordinary bug, even when the bug has an obvious cheap test target. Writes end-to-end tests, not unit tests. Skip when no end-to-end path is practical, and say so."
disable-model-invocation: true
---

# TDD Bug Fix

Run this when the user asked for TDD, a failing test, or a regression test in the current request. Also run it, without being asked, before a hard problem where a wrong result is costly or hard to undo, such as a database migration. A cheap local test target is not a trigger on its own. For any other change, fix it and verify it with the closest executable check instead of adding a test.

Make the broken or required behavior executable before changing production code. The goal is a focused end-to-end test that fails before the change and passes after it. End-to-end tests are the ones that count. Do not write a unit test unless the user asks for a unit test.

Do not force a test when it would be impractical. A hard problem such as a database migration is the exception: there the end-to-end test is the point, so build the path it needs or report why you cannot. If the available test would require broad harness setup, brittle mocks, slow end-to-end infrastructure, production-only state, vague reproduction steps, or large unrelated fixture churn, skip adding a new test and use the closest useful verification instead.

## Workflow

1. **Understand the bug.** Identify the intended behavior, current behavior, affected path, and smallest observable reproduction.
2. **Choose the narrowest end-to-end check.** Prefer the closest end-to-end or integration test already used for that codepath, one that runs the real path a user or caller takes. For a migration, run it against a copy of real data and assert on the stored result. If no practical test path is obvious, do not create one from scratch just to satisfy the workflow.
3. **Write the failing test first.** Add the smallest focused test that would have caught the bug. The test should encode intended behavior, not mirror the current implementation.
4. **Run the new test before fixing.** Confirm it fails for the intended reason. If it passes or fails for an unrelated reason, correct the test or reproduction before editing the implementation.
5. **Fix the bug.** Make the smallest production change that satisfies the intended behavior while preserving nearby contracts.
6. **Rerun the regression test.** Confirm the test now passes.

## If a Failing Test Is Impractical

Use the closest executable regression check instead: a targeted script, manual reproduction command, browser automation, snapshot comparison, log assertion, or focused integration check.

Prefer no new test over a bad test. A bad test is one that mostly tests mocks, encodes current implementation details, depends on timing or unrelated global state, needs expensive infrastructure for a small fix, or would be deleted immediately after proving the fix.

## Guardrails

- Do not change tests merely to match a wrong implementation.
- Do not weaken existing assertions unless the expected behavior has genuinely changed and the reason is clear.
- Keep the regression test focused on the bug. Avoid broad fixture churn or unrelated coverage expansion.
- If the bug is flaky, make the test deterministic where possible and document the signal being locked down.
- If the bug exposes a broader class of failures, land the focused regression path and name the sibling cases in the reply. Add sibling tests only if the user asks.

## Final Response

Report the evidence, not just the outcome:

- Name the failing-before test or executable check and the failure it produced.
- Name the passing-after test run and any nearby validation performed.
- If failing-before evidence could not be demonstrated, state why and describe the closest regression check used instead.
