### Pause safely

**You own a clean stop. Leave a checkpoint a cold-start agent can resume from.** This is explicit only. On "keep going", "going to bed, keep going", or "don't stop", do not pause.

1. Stop at a safe boundary. Finish the current atomic step or back out of it. Start nothing new, and cancel any nested subagents (`task_cancel` for delegated tasks). Call `unwatch_pull_request` on any PR this thread watches.
2. Take no irreversible action to pause. No commit, push, or PR unless the user's current request grants it.
3. Make the work durable. Leave uncommitted edits in the worktree and save a patch beside the resume note (`git diff HEAD > <resume-dir>/<slug>.patch`) with the untracked files listed. When the user's request grants committing, commit them instead as one clear `wip:` commit on the current branch. If the tree is broken, say so in the note or the commit body in one line.
4. Write the resume note off-context. Capture intent, what you were doing, progress and what's verified, current state, next steps, key files, and gotchas. For the compaction trigger write it to a file like `/tmp/<slug>-resume.md`. If a show-me-your-work trail exists, point at it instead of duplicating it.

**Reply:** where you are in the loop, what's on disk versus still in your head (paths, no diff dumps), any commits you made and whether the tree is clean, where the patch and note live, and the first action on resume. This is a pause, not a final report.
