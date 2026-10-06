---
name: swarm
description: "Fan out N parallel workers, drain them, and return one report. Use for /swarm, 'swarm this', or parallel coverage, races, gauntlets, and exploration."
disable-model-invocation: true
---

# Swarm

Fan out N parallel workers. They may cover separate slices, race the same brief, or mix both. The parent waits, aggregates, and returns one report.

## Start

Open a todo list (`TodoWrite` in Claude Code, `update_plan` in Codex) with one entry per phase before launching anything.

1. Frame
2. Fan out
3. Aggregate
4. Report

## Phase A: Frame

1. State the done predicate and the artifact or report the swarm must return.
2. Choose the shape. Partition into slices, race N workers on identical briefs, or mix both. For a race or mixed shape, declare `first pass`, `rank all`, or `best-of` before spawning.
3. Set N from the user or derive it from the shape. N is total workers, not the concurrency limit.
4. Pick the worker model from the `swarm workers` line in `~/.agents/fly-models.md`. An entry reads `<providerInstanceId>/<model>@<effort>`. If the file or that line is missing, use the `swarm workers` default in `../setup-fly/references/default-models.md` and say so. For `inherit-parent`, leave the model unset so the workers run on the current thread's model. Effort follows the role line: OpenAI models (provider `codex`) run at `xhigh`, Claude models at `high` or below, unless the user asks for different effort in this request. If `orchestrator_capabilities` does not list the configured model, use the default and say so. If it lacks the default too, use the closest model from the same provider and say so. For a model race, name each arm's provider and model up front.
5. Give each worker that writes its own git worktree and branch. Workers never share a working tree. When workers verify or measure commits, each brief names the exact SHAs. A measurement brief also names the method (sample count, what one sample is, order). The worker records both in its result.

## Phase B: Fan out

Spawn all N workers in one message. Pick the tool per worker:

- **Same provider as the current thread, model the native tool can run.** In Claude Code, use `Agent` with `subagent_type: "general-purpose"`, `model` set to the family alias (`opus`, `sonnet`, `haiku`) or unset for `inherit-parent`, `run_in_background: true`, and `isolation: "worktree"` when the worker writes. In Codex, use its native subagent tool.
- **Another provider, or a model or effort the native tool cannot set.** Use T3 `delegate_task` with `target.providerInstanceId`, `target.model`, and the effort in `target.options`, all as listed by `orchestrator_capabilities`. Use `mode: "async"` and a distinct `clientRequestId` per worker. Track each worker by its `taskId` with `task_status`. For a writing worker, create its worktree first (`git worktree add -b <branch> <path> <base-commit>`) and pin the brief to that path.

When a worker must start from a non-default base, the brief names the branch and commit, and its worktree is created from that commit.

Workers do not commit, push, or open PRs. They leave their changes in their worktree and report the path and branch. Anything past that waits for the user's approval.

Every brief stands alone. Include the goal, scope, exact slice or race arm, how to verify, and what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence. A worker that can prove a defect reports `ISSUES` and lists every issue it can prove, not only the first.

If a worker drops out, proceed with N-1 and note it.

## Phase C: Aggregate

Read the terminal results. Drop a result that does not record the SHAs and method its brief names, and respawn that worker once. After a second miss, record a gap. A gap does not count as a pass. For coverage, every required slice needs a result. For a race, apply the selection rule declared up front. Use first pass, rank all, or best-of. Do not paste raw worker dumps.

Keep a compact result table, one-line evidenced issues, and explicit gaps or dropouts.

## Phase D: Report

Return one consolidated in-chat report with the table, issue one-liners, gaps or dropouts, the race rule when used, and the worktree path and branch of every worker that wrote.
