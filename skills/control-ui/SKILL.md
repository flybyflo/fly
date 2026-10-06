---
name: control-ui
description: Drive and inspect a web, IDE, or Electron UI with evidence. Prefers a gpt-6.1-sol worker using the user's real Chrome or Computer Use, then Claude in Chrome, the T3 preview tools, or a local CDP harness. Use for local UI verification, screenshots, accessibility snapshots, perf profiles, visual diffs, or reproducing UI bugs.
---

# Control UI

Use browser automation to verify UI behavior with evidence. Pick the driver in this order:

1. The repo's own Playwright, browser, or Electron harness, when one exists and the check is scripted.
2. **Preferred for live driving: a `gpt-6.1-sol` worker with Chrome or Computer Use.** The model comes from the `ui driver` role in `~/.agents/fly-models.md` (default `codex/gpt-6.1-sol@xhigh` from `../setup-fly/references/default-models.md`).
   - From a Codex thread already on that model, drive it yourself. From any other thread, start the worker with T3 `delegate_task` (`target.providerInstanceId: "codex"`, `target.model: "gpt-6.1-sol"`, effort `xhigh`, `mode: "async"`), track it with `task_status`, and review its evidence yourself.
   - The worker uses Codex's `control-chrome` skill for a web UI in the user's real Chrome (new tab, keeps their sign-ins), and Codex's `computer-use` skill for Electron, IDE, or other desktop app UI.
   - The brief names the app and URL or window, the exact scenario, the pass predicate, and where to save screenshots or a recording. The worker reports PASS, ISSUES, or BLOCKED with that evidence and changes no code.
3. When the Codex worker is unavailable (no `codex` provider in `orchestrator_capabilities`, or its Chrome or Computer Use plugin fails), the user's real Chrome through Claude in Chrome (`mcp__claude-in-chrome__*`, Claude Code), or the T3 `preview_*` tools in either host (`preview_open` with the local URL, `preview_snapshot` for page state plus screenshot, `preview_click`, `preview_type`, `preview_press`, `preview_scroll`, `preview_resize`, `preview_wait_for`, `preview_evaluate`, `preview_recording_start` / `preview_recording_stop` for a clip). Say which fallback you used and why.
4. A temporary local CDP harness for perf, memory, or network work that needs raw CDP, or when no real browser is reachable.

A headless browser is never the default. Launch one only when the user asks or no real browser is available, and say so.

## What It Is Used For

- Reproducing UI bugs that depend on real browser focus, keyboard input, scrolling, resizing, or rendering.
- Verifying visual or accessibility changes with screenshots and snapshots.
- Checking local web, IDE, or Electron behavior before shipping.
- Capturing console logs, network logs, CPU profiles, traces, or heap snapshots.
- Creating before/after evidence for a project's `verify-*` skill (see **create-verification-skill**).

## Setup Pattern

1. Start the app locally using the repo's documented dev command (`Bash` with `run_in_background` in Claude Code, a background exec in Codex).
2. Discover existing local harnesses: Playwright tests, Cypress specs, Storybook, browser scripts, Electron launch scripts, or snapshot tools.
3. For a web app, open the local URL in the chosen driver.
4. For Electron/Chromium, enable a remote debugging port when supported.
5. Select the correct page or tab by stable app markers, not by tab order alone.
6. Prefer accessibility roles, labels, and stable `data-*` selectors over coordinates.

## Generic Web Harness

Only when the drivers above are unavailable. Use the repo's installed browser tooling when possible. If the repo already has Playwright, a minimal one-off probe looks like:

```javascript
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://127.0.0.1:<port>");
await page.getByRole("button", { name: "Submit" }).click();
await page.screenshot({ path: "/tmp/ui-harness-after.png", fullPage: true });
await browser.close();
```

Do not add Playwright as a project dependency just for this probe unless the user asks. Prefer existing dev dependencies or browser tools already available in the environment.

## Generic CDP Harness

For Electron or a Chromium app launched with `--remote-debugging-port=<port>`, connect over CDP:

```javascript
import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://127.0.0.1:<debug-port>");
const pages = browser.contexts().flatMap((context) => context.pages());
let page;
for (const candidate of pages) {
  if (await candidate.locator("<app-root-selector>").count()) {
    page = candidate;
    break;
  }
}

if (!page) {
  console.log(await Promise.all(pages.map(async (p) => ({
    title: await p.title(),
    url: p.url(),
  }))));
  throw new Error("No matching app page found");
}

await page.screenshot({ path: "/tmp/ui-harness-cdp.png", fullPage: true });
await browser.close();
```

Replace `<app-root-selector>` with a stable marker from the current repo, such as a root app node, landmark, or product-specific `data-*` attribute.

## Interaction Loop

1. Capture a page snapshot or screenshot before acting.
2. Choose a target from the latest page structure.
3. Perform exactly one structural action: click, type, keypress, drag, scroll, navigate, or resize.
4. Capture a fresh snapshot/screenshot.
5. Verify the expected state change.
6. Save artifacts for before/after comparisons when the user asked for proof (the worker's saved screenshots, or `preview_snapshot` with `save: true`, return a path you can show the user).

## CDP Capabilities

Use raw CDP only when higher-level browser APIs are insufficient:

- Performance: CPU profiles, traces, paint flashing, FPS meter, layout shift inspection.
- Memory: heap snapshots and forced GC for leak investigations.
- Network: request blocking, throttling, cache disablement, request/response logs.
- Rendering: viewport changes, color scheme emulation, reduced motion, accessibility checks.
- Debugging: console streaming, exception capture, DOM snapshots.

## Page Selection

When multiple app windows/tabs share a debug port:

- Prefer a positive marker for the surface under test, such as an app root selector.
- Use a negative marker to avoid the wrong surface when necessary.
- If no page matches, list available page titles and URLs instead of guessing.

## Guardrails

- Do not rely on stale element references after navigation or structural changes.
- Avoid coordinate clicks unless a fresh screenshot was captured immediately before the click.
- Keep test data local and disposable.
- In the user's real Chrome, work in a new tab and leave their other tabs and sessions alone.
- Do not store screenshots or heap snapshots from privacy-sensitive workspaces unless the user explicitly agrees. Screenshots and recordings never go into version control without asking.
- Do not hard-code selectors, ports, or script paths from another repository. Discover the current repo's local app markers.
- Clean up dev servers, debug sessions, and temp profiles when done.
