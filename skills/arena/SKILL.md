---
name: arena
description: "Spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it. Use for /arena, 'arena this', 'throw it in the arena', or when one attempt at a non-trivial artifact would lock in the wrong shape."
disable-model-invocation: true
---

# Arena

Fan out N parallel attempts at the same task. Read every candidate end to end. Pick the strongest as the base. Graft the best ideas from the others into it. Verify the synthesized result.

## Start

Open a todo list (`TodoWrite` in Claude Code, `update_plan` in Codex) with one entry per phase before launching anything.

1. Frame
2. Fan out
3. Cross-judge
4. Pick
5. Graft
6. Verify

## Phase A: Frame

The N candidates will receive the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive the rubric. State what success looks like for *this* task, then turn it into 3-6 concrete gradeable criteria. The rubric is the picker's tool in Phase D. Candidates only see the task.
3. Pick the runners. Use the `arena runners` line in `~/.agents/fly-models.md`. An entry reads `<providerInstanceId>/<model>@<effort>`. If the file or that line is missing, use the `arena runners` default in `../setup-fly/references/default-models.md`, and say so. The defaults put GPT and Claude on the same brief on purpose. Keep the panel mixed across providers and model families. An `inherit-parent` entry in this line or the cross-judge line means the current thread's model, so leave the model unset for it. Effort follows the role line: OpenAI models (provider `codex`) run at `xhigh`, Claude models at `high` or below, unless the user asks for different effort in this request. Check every entry against `orchestrator_capabilities`. If it does not list a configured model, run that seat on its provider's entry from the `arena runners` default and say so. With no provider match, use `codex/gpt-6-astra@xhigh`. If it lacks a default too, use the closest model it lists from the same provider. Spawn more when the arena covers multiple design directions. Same model N times when the work is generation-bound rather than judgment-sensitive.
4. Assign output paths. Each candidate writes to its own location (a git worktree and branch where possible, otherwise `/tmp/arena-<slug>/candidate-<n>/`), per the **separate-before-serializing-shared-state** principle skill.

## Phase B: Fan out

Spawn all N candidates in one message, each with the task, the path to the shared grounding, its own output path, and instructions to produce both the artifact and a short rationale. Pick the tool per seat:

- **Same provider as the current thread, model the native tool can run.** In Claude Code, use `Agent` with `subagent_type: "general-purpose"`, `model` set to the family alias (`opus`, `sonnet`, `haiku`) or unset for `inherit-parent`, `run_in_background: true`, and `isolation: "worktree"` when its output path is a worktree. In Codex, use its native subagent tool.
- **Any other seat.** Use T3 `delegate_task` with `target.providerInstanceId`, `target.model`, and the effort in `target.options`, all as listed by `orchestrator_capabilities`. Use `mode: "async"` and a distinct `clientRequestId` per seat. Track each seat by its `taskId` with `task_status`. When its output path is a worktree, create it first (`git worktree add -b <branch> <path> <base-commit>`) and pin the brief to that path.

Candidates do not commit, push, or open PRs. Each leaves its artifact in its own output path and reports that path.

Each rationale names the alternatives the candidate considered and what it rejected.

If a candidate fails to produce output, proceed with N-1 and note the dropout in the synthesis record.

## Phase C: Cross-judge

After all Phase B candidates complete, choose one model from the `arena cross-judge pool` line in `~/.agents/fly-models.md`. If the file or that line is missing, choose from the `arena cross-judge pool` default in `../setup-fly/references/default-models.md`, and say so. Prefer a different provider and model family from the parent's: a Claude parent gets a GPT judge, a GPT parent gets a Claude judge. Spawn one read-only judge on that model with the same tool choice as Phase B, minus the worktree. Its brief says it writes nothing. It sees the rubric and the candidates by path label, scores each criterion, and recommends a base with rationale. It runs in parallel with the parent's reading in Phase D, not with the candidates themselves. Don't spawn the judge while candidates are still writing.

## Phase D: Pick a base

Read every candidate end to end before picking.

Score each candidate against the rubric criterion by criterion, not on holistic feel. Compare against the cross-judge. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base on which candidate a future maintainer can extend most easily without breaking invariants. Prefer the cleaner boundary or smaller API when two feel tied, per the Laziness Protocol.

Record the pick and the reason in a short synthesis note alongside the base artifact, including the cross-judge's verdict.

## Phase E: Graft

Walk each losing candidate once more and identify what is worth porting into the base. The signal is usually one or two things per candidate, not most of it.

Fold each graft in by hand, per the **redesign-from-first-principles** principle skill. Don't paste mechanically. The result has to remain coherent under one mental model.

Record what was grafted, from which candidate, and what was rejected and why.

When N candidates converge on the same shape, that is a strong agreement signal. Note the convergence in the record and ship the consensus shape. No graft is needed. When N candidates wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

The synthesized artifact has to hold up under the same scrutiny as any other output, per the **prove-it-works** principle skill.

If verification surfaces a problem the arena did not catch, either Phase A was wrong (re-frame and re-run) or one candidate caught it and you missed the graft (go back to Phase E). Don't paper over.

## Outputs

One synthesized artifact. One short synthesis note alongside, naming the base, the grafts (with source candidate), the rejections, the dropouts if any, and the verification result.
