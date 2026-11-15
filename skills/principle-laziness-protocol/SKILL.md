---
name: principle-laziness-protocol
description: "Apply when refactoring, evaluating diff size, sequencing an addition or rewrite, or tempted to add abstractions, layers, or signal threading. Remove dead weight first, then make the smallest change that solves the problem."
disable-model-invocation: true
---

# Laziness Protocol

Aim for the most result with the least code and complexity.

- **Prefer deletion.** When asked to refactor or improve, look for removals before additions.
- **Subtract before you add.** Sequence removal before construction. Remove dead code, redundant validators, and stub references first, then build on the simpler base. Removing first leaves less code, reveals the essential structure, and usually makes the next design obvious. Cut to the minimum before you polish.
- **Build for observed usage.** No speculative validators, parsers, or guards beyond what the spec demands. Simplify prompts by removing redundant instructions and excess templates. When a reference has no novel content, delete it rather than leaving a stub.
- **Maintain a flat call hierarchy.** Avoid deep call chains. A rich interface that hides substantial work is not a deep call chain. If answering a question requires tracing through more than 3 files or layers, flatten it.
- **Consolidate decisions.** Do not repeat the same choice in several places. Put it behind one source of truth and pass the result as a simple flag.
- **Minimize the diff.** Make the smallest change that solves the problem. Fewer lines beat "elegant" boilerplate.
- **Question the threading.** If a task asks you to pass a new signal through types, schemas, pipelines, or similar layers, stop and look for a more direct path.
- **Sweat the small leaks.** Remove tiny pass-throughs, representation leaks, and duplicated choices before they spread. Small leaks compound into permanent coordination costs.

Make simplification a continual investment. Leave the design slightly simpler and more capable than you found it, behind the same or a smaller interface.

**The test:** If a human developer would find the code exhausting to maintain, it is a bad solution.
