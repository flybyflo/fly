---
name: principle-foundational-thinking
description: "Apply before writing logic: choosing core types and data structures, and sequencing scaffold-vs-feature work. Get the data structures right so downstream code becomes obvious."
disable-model-invocation: true
---

# Foundational Thinking

**Structural decisions** protect option value. **Code-level decisions** protect simplicity.

**Data structures first.** Get the data shape right before writing logic. Define core types early, trace every access pattern, and choose structures that match the dominant paths.

At code level, DRY the structure, not every line. Types and data models should converge. Three similar statements still beat a premature abstraction. Prefer explicit over clever. Test behavior end to end, not line counts.

**Scaffold first.** If something helps every later phase, do it first. Ask "does every subsequent phase benefit from this existing?" CI, linting, test infrastructure, and shared types are scaffold. Sequence for option value: setup before features, a failing repro before a fix, and an end-to-end test before a hard change such as a database migration. Keep commits small and single-purpose.

Each increment should land a coherent abstraction or deepen one that exists. Do not spread a new capability across callers as special-case coordination.

Subtraction comes before scaffolding, per the [Laziness Protocol](../principle-laziness-protocol/SKILL.md). Remove dead code first, then lay foundations.
