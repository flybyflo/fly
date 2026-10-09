# Design before you write code

[Build](../../skills/fly/playbooks/build.md) starts by framing the done predicate and data shape on the `architecture` role. A novel design may need prototypes before implementation. A `check` reviewer then checks the code that gets built.

The two most common design mistakes are taking the agent's first design and polishing a plan that no code has tested. This page fixes both. Prototypes answer the open questions, a README or tutorial sets the target, and the written plan comes last.

## Frame the shape with Build

```text
/fly design the import pipeline before writing production code. name the data shape and show how callers will use it. let me review before implementation.
```

Name the result and the proof before choosing types and boundaries. Use [`/how`](../../skills/how/SKILL.md) to trace unfamiliar code and [`/why`](../../skills/why/SKILL.md) when the reasons for its ownership matter. Large work splits into units that each end in a verifiable state.

## Review the diff

Build sends the diff and brief to a `check` reviewer. The parent judges each finding, rejects wrong ones with a reason, and sends accepted blocking findings to a fresh agent on the role that wrote the code. Review repeats until no blocking findings remain, with a maximum of three rounds.

The `check` model comes from your [`/setup-fly`](../../skills/setup-fly/SKILL.md) configuration. Keep it on a different model family from `implement` and `design`, so the same brief gets independent scrutiny. Read the rejected findings too. You can challenge the parent's judgment.

## Prototype instead of debating

Never take the first design. Ask for a few, and pick from evidence you can see:

```text
/fly prototype a few options for the new dropdown menu. take screenshots or videos for me to compare.
```

The [Exhaust the Design Space principle](../../skills/principle-exhaust-the-design-space/SKILL.md) asks for two or three concrete alternatives when an interaction or design has no precedent. Run them and compare screenshots, behavior, or timings. Prototypes let the agent answer observable questions before asking you to choose.

The same idea scales up to a real design. Ask for prototypes and keep a review gate:

```text
/fly we need rate limiting for external webhooks. frame the data shape and answer open questions with prototypes. let me review before implementation.
```

Don't spend reviewers on an abstract plan. Build's review loop checks a diff. Point adversarial review at a plan with no code behind it and the reviewers invent theoretical risks and edge cases that will never happen. Let prototypes settle the questions, then review what got built.

## Write the README first for shared code

For a package or API that other code will use, start with the doc a user would read:

```text
/fly write a tutorial for how i would use the new config package first. then /teach me why it beats the current one.
```

Writing the tutorial first forces the caller's view. You describe the API to a hypothetical user and work back to the implementation. The doc also becomes a concrete target the agent checks its own work against. Name [`/technical-writing`](../../skills/technical-writing/SKILL.md) when the doc itself matters, so a tutorial stays a tutorial instead of drifting into reference and explanation at once.

## Plan after the design settles

fly has no planning skill, on purpose. When you do want a written plan, ask for it once the design is settled:

```text
/fly turn this design into a plan. small verifiable PRs, each with its own verification steps.
```

Ask for a plan as the deliverable when you want to review the units before implementation. Each unit ends in proof that the change works. A passing test suite alone doesn't count as that proof. Once you approve proceeding, each code unit follows Build.

For a migration, state the bar in the prompt:

```text
/fly plan the migration of our ui library to the new styling system. small verifiable PRs, each with visual regression checks. the result must match the original exactly, bugs included.
```

"bugs included" keeps the migration from quietly fixing things on the way, which would make the old and new output impossible to compare. For a project that spans many days, you can commit the plan to the repo for a while so other agents see the work in progress. Delete it when the work lands.

## How much design work does a task deserve?

Every code change uses Build, but not every change needs prototypes or a written plan:

- A familiar, small change needs a done predicate and data shape, then implementation and the two loops.
- An open question you can answer by running something gets a local experiment.
- A novel interaction or design gets competing prototypes.
- Work that spans several PRs gets verifiable units and a plan when you ask for one.

Keep the framing proportional to the change. Review the actual diff before shipping.

Next: [Build and clean the change](./05-build-and-clean.md).
