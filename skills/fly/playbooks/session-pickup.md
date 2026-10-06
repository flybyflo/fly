### Session pickup

**You own the resume point. Read the prior trail, don't redo it.**

1. Locate the prior trail. A T3 thread (`t3_thread_search`, `t3_thread_read`, `t3_thread_list`, which cover Claude Code and Codex threads), a local transcript of this project (`~/.claude/projects/<slug>/*.jsonl` for Claude Code, `~/.codex/sessions/**/*.jsonl` filtered to this project's working directory for Codex), a worktree, or a pushed branch. Stay inside this project's transcripts. Globbing across every project reads private chats from unrelated work. Read the metadata overview and last messages first, then scan back for the decision points. Parse a long transcript in a subagent and keep the reduced timeline in the main thread (the **principle-guard-the-context-window** skill).
2. Reconstruct operational state. The branch and worktree, what already landed (`git log`, `git diff` against the base), the open todos, the decisions made. The prior trail is authoritative input. Resist the bias to re-derive it.
3. Diff done vs pending. Compare what shipped against what was planned, name the resume point, do not re-run the prior repro or redo completed work. A "let me verify from scratch" pass means you're treating the trail as untrustworthy when it's authoritative.
4. Route the remaining work to the matching playbook and pick the verdict: continue the execution, ship a finished recommendation, ratify or override a prior conclusion, or postmortem a failed run. The pickup playbook ends here. The routed playbook owns the rest, including its gates. A prior session's approval to commit, push, or open a PR does not carry into this one.
5. Verify the inherited claims against the original goal on the real artifact (the **principle-prove-it-works** skill). A passing prior self-report is not the proof.

**Reply:** where the prior agent stopped, what you inherited vs redid (ideally nothing redone), the resume point, and the outcome.
