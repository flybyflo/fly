# Build

Any change to code: a feature, bug fix, refactor, perf fix, UI work, migration, or a long task that runs until done. One flow with two loops.

## 0. Frame

Framing runs on the `architecture` role. When the current thread is not on that model, hand steps 1, 2 and 4 to a fresh `architecture` agent, check its answer, and adopt it.

1. Write the done predicate: what is true when this is finished, and how you will prove it.
2. Name the data shape the change works on.
3. Bug: reproduce it on the real surface first. Perf: measure the baseline first (**benchmark-checklist**).
4. Large or long work: split it into units that each end in a verifiable state. Each unit runs steps 1 to 3. Keep a decision log through **show-me-your-work** and keep going until the predicate holds.
5. A novel design or architectural decision with no precedent: the `architecture` agent runs **principle-exhaust-the-design-space** before any unit starts.

## 1. Implement

Delegate each unit to a fresh agent. UI changes (components, styling, layout, browser behaviour) go to the `design` role. Everything else goes to the `implement` role. Split a unit that touches both. The brief names the goal, scope, data shape, done predicate, and the repo's `AGENTS.md` / `CLAUDE.md`. The agent edits the working tree, runs the fast checks, and never commits.

## 2. Review loop

1. A `check` reviewer reads the diff and the brief: correctness, missed cases, design, scope creep. It returns blocking and non-blocking findings with `file:line`.
2. Judge every finding yourself. Reject a wrong one with a reason.
3. Send the accepted blocking findings to a fresh agent on the role that wrote the code, with the brief, the diff, and the findings.
4. Repeat until the reviewer has no blocking finding. After 3 rounds, stop and report what is still open.

## 3. Verification loop

1. Run **deslop** on the diff, and **react-doctor** when React code changed.
2. Rules review. A `check` agent checks the diff against every applicable instruction file (the repo's root and nested `AGENTS.md` / `CLAUDE.md`, plus the global `~/.codex/AGENTS.md` and `~/.claude/CLAUDE.md`) and lists each violation with the rule it breaks.
3. Team review. A second `check` agent runs the repo's own review workflow over the branch, such as its `team-review` skill or `code-reviewer` agent, and returns findings with `file:line`. With no such workflow, it reviews against the repo's documented review rules. Steps 2 and 3 run in parallel.
4. Run the typecheck, lint, and affected tests. Prove the done predicate on the real surface (**control-ui** or **control-cli**), not with a proxy.
5. Judge every finding, send the accepted ones to a fresh agent on the role that wrote the code, then rerun the whole block. Repeat until it is clean. After 3 rounds, stop and report what is still open.

## 4. Report

State what changed, what the loops found and fixed, what is still open, and the proof. Then stop at the gate. Commit, push, and the PR (`playbooks/opening-a-pr.md`) happen only once the user approves.
