# Recipes and pitfalls

Prompts worth copying, then the mistakes everyone makes once. Swap in your own paths and finish conditions. The recipes are deliberately informal. That's how they get typed in practice, and the skills read intent fine.

## Understand an unfamiliar subsystem

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

Mechanics first, history second. Each skill's report tells you which sources it searched, so you know what the answer is grounded in.

## Restate a noisy report before touching code

```text
/fly read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

A misreading shows up in the restatement, where it costs one message to correct. Keep your own theory to yourself until the agent has stated its own.

## Prototype before you pick

```text
/fly prototype a few options for the settings layout. put them behind a switcher and send me screenshots of each.
```

You pick from things that run, not from descriptions. The agent answers its own layout and timing questions along the way.

## Turn a settled design into a plan

```text
/fly turn this design into a plan. small verifiable PRs, each with its own proof.
```

Ask only after the design settles. The plan is the deliverable. Code work follows Build once you approve proceeding.

## Check independent slices in parallel

```text
/fly check every package under packages/ against its check.sh. use parallel verification subagents, one per package. one report.
```

Each worker owns one package and its own worktree. The parent waits for every slice and reports the evidence and gaps.

## Review a branch skeptically

```text
/fly review the whole branch with the review panel. don't change anything yet. focus on actual bugs and regressions.
```

The qualifiers do real work. "don't change anything yet" keeps it read-only, and the parent judges each finding before accepting it.

## Fix a bug through a failing test

```text
/fly repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

"/tdd it" matters, because nothing adds a regression test unless you ask. "if there's a cheap test path" matters too. Forcing a test through brittle mocks proves less than running the real command, and the playbook is allowed to say so.

## Repro and fix a report with proof

```text
/fly repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

"if it repros on main" lets the run stop early when the bug is already gone. The video lets you check the fix before you read the diff.

## Vet a number before you post it

```text
/benchmark-checklist vet this 40% speedup before it goes in the pr description
```

You get faster, slower, no measurable difference, or inconclusive, with the run count, the range, and what limits the number.

## Stop correcting the same mistake

```text
/correct agents keep adding new config flags without registering them in the schema
```

The fix lands in the repo as architecture, a type, a lint, or a test, so the next agent can't make the mistake.

## Ask how without starting the work

```text
/fly-help how do i get fly to stay on every turn?
```

You get an answer, a prompt to send, and a link to the source. Nothing runs until you send that prompt.

## Keep a run honest while you're away

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

The full contract is on the [overnight page](./07-overnight.md). The short form works once the task and finish condition are already in the conversation.

## Redirect a drifting run

Steering prompts are one line:

```text
i said the goal is to repro. i did not ask for a fix yet.
```

```text
apply prove it works. show me the real output, not the build log.
```

```text
/unslop that, no emdashes
```

You rarely need more words. You need the right name, and [the principles page](./08-principles.md) is the vocabulary.

## Get the reply in plain words

```text
/bro
```

That's the whole prompt. [`/bro`](../../skills/bro/SKILL.md) restates the last message like one human talking to another, no jargon, shorter. Use it when a reply is technically thorough and you still don't know what it said.

## The pitfalls

- **Enumerating skills in the prompt.** "use /how then /deslop then /no-comments" reorders steps the playbook already sequences. State the goal and constraints. Name a skill only to override a default.
- **A vague finish condition.** "make it better" gives `/loop` nothing to check. Give a command or artifact that can pass or fail.
- **Leading with your theory of the cause.** The agent searches wherever you pointed. Ask it to restate the problem first, then share your hunch.
- **Taking the first design.** One attempt locks in the first shape the model thought of. Ask for prototypes and pick from evidence.
- **Polishing an abstract plan.** Adversarial review of a plan with no code behind it invents risks that will never happen. Settle the open questions with prototypes, then review what got built.
- **Parallel agents in one worktree.** They overwrite each other and the diff becomes archaeology. Say "own worktree per attempt", or launch each as its own T3 thread with a worktree strategy.
- **Looping before you trust the loop.** A loop that can't verify its own work only makes unchecked work faster. Get the verification skill working first.
- **Trusting an unvetted number.** A warm cache or a skipped code path can fake a speedup. Run `/benchmark-checklist` before the number goes anywhere.
- **Correcting the same mistake by hand.** A correction in chat helps one run. `/correct` fixes the repo so no later run repeats it.
- **Accepting every review comment.** Bots and humans both file real catches and noise in one list. Build's parent judges each finding and rejects wrong ones with a reason.
- **Treating `inherit-parent` as a model slug.** It means "run this role on the current thread's model." [Setup](./01-setup.md) covers the roles.
- **Expecting a run to commit, push, or merge on its own.** Those are approval gates. Name each one you grant in the request, or the run stops there with a ready summary.
- **Reporting success off a green build.** A build proves it compiles. Ask for the real command, flow, stored value, or profile, and expect the evidence in the reply.
- **Writing a `SKILL.md` freehand.** Route it through the [Authoring or modifying a skill playbook](../../skills/fly/playbooks/authoring-a-skill.md) so validation and review happen.

That's the guide. If you skipped ahead, go back to [setup](./01-setup.md) and run one real task. The habits stick from use, not from reading.

Back to the [guide index](./README.md).
