#!/usr/bin/env node
import fs from "node:fs";
import process from "node:process";

const RULE =
	"Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.";
const LANES_PREFIX = "Ten lanes on `";
const LANES_SUFFIX = " at the PR head";
const SUB_BLOCKS = [
	"Depends on.",
	"Files.",
	"Build.",
	"You see.",
	"Verify, unit.",
	"Verify, live.",
	"Verify, perf.",
	"Review gate.",
	"Merge.",
];
const PROGRAM_H3 = ["Arm the program", "Spawn owners", "PR mechanics", "Verdict and merge", "Boot recipe"];
const PROGRAM_MARKERS = ["git show origin/main:", "/loop 1h", "status message"];
const HOW_TO_READ_MARKERS = [
	"One box is one unit of work",
	"names the evidence",
	"Check a box only when its evidence exists",
	"playbooks/",
	RULE,
];
const PERF_ITEMS = ["Metric.", "Probe.", "Baseline.", "Rule."];
const LONG_DASHES = ["–", "—"];
const CURLY_QUOTES = ["‘", "’", "“", "”"];
const BOX_MARKERS = ["- [ ] ", "- [x] "];

const isWhitespace = (ch) => ch.trim() === "";
const isDigit = (ch) => ch >= "0" && ch <= "9";

// Returns the box text after "- [ ] " or "- [x] ", or null when the line is not a box.
const boxText = (text) => {
	const trimmed = text.trimStart();
	for (const marker of BOX_MARKERS) {
		if (trimmed.startsWith(marker)) return trimmed.slice(marker.length);
	}
	return null;
};

// Collapses every inline code span to a lone backtick.
const collapseCodeSpans = (text) => {
	let out = "";
	let i = 0;
	while (i < text.length) {
		const open = text.indexOf("`", i);
		if (open === -1) return out + text.slice(i);
		const close = text.indexOf("`", open + 1);
		if (close === -1) return out + text.slice(i);
		out += text.slice(i, open) + "`";
		i = close + 1;
	}
	return out;
};

// Removes image markup and link targets so their URLs do not trip the prose checks.
const stripLinks = (text) => {
	let out = "";
	let i = 0;
	while (i < text.length) {
		const close = text.indexOf("](", i);
		if (close === -1) return out + text.slice(i);
		const end = text.indexOf(")", close + 2);
		if (end === -1) return out + text.slice(i);
		const open = text.lastIndexOf("[", close);
		const isImage = open !== -1 && open > 0 && text[open - 1] === "!" && open >= i;
		if (isImage) {
			out += text.slice(i, open - 1);
		} else {
			out += text.slice(i, close + 1);
		}
		i = end + 1;
	}
	return out;
};

const hasAny = (text, needles) => needles.some((needle) => text.includes(needle));

const hasMidSentenceColon = (text) => {
	let at = text.indexOf(": ");
	while (at !== -1) {
		const next = text[at + 2];
		if (next !== undefined && !isWhitespace(next)) return true;
		at = text.indexOf(": ", at + 1);
	}
	return false;
};

// Parses "**Name** rest" into { name, rest }, or null when the line has no bold lead-in.
const boldLeadIn = (text) => {
	if (!text.startsWith("**")) return null;
	const end = text.indexOf("*", 2);
	if (end === -1 || end === 2 || text[end + 1] !== "*") return null;
	return { name: text.slice(2, end), rest: text.slice(end + 2) };
};

// Parses "Lane <n>. ..." into the lane number, or null.
const laneNumber = (text) => {
	if (!text.startsWith("Lane ")) return null;
	let i = "Lane ".length;
	let digits = "";
	while (i < text.length && isDigit(text[i])) {
		digits += text[i];
		i += 1;
	}
	if (digits === "" || !text.startsWith(". ", i)) return null;
	return Number(digits);
};

const namesScreenshot = (text) => {
	const open = text.indexOf("Save `");
	if (open === -1) return false;
	const start = open + "Save `".length;
	const close = text.indexOf("`", start);
	return close > start;
};

const namesLaneModel = (text) => {
	const open = text.indexOf(LANES_PREFIX);
	if (open === -1) return false;
	const start = open + LANES_PREFIX.length;
	const close = text.indexOf("`", start);
	if (close === -1 || close === start) return false;
	const model = text.slice(start, close);
	if (model.includes("<") || model.includes(">")) return false;
	return text.startsWith(LANES_SUFFIX, close + 1);
};

const slug = (name) =>
	name
		.split("")
		.map((ch) => (ch === " " || ch === "," || ch === "." ? "-" : ch))
		.join("")
		.split("-")
		.filter((part) => part !== "")
		.join("-")
		.toLowerCase();

const file = process.argv[2];
if (!file) {
	console.error("Usage: node check-plan.mjs <plan.md>");
	process.exit(2);
}

const raw = fs
	.readFileSync(file, "utf8")
	.split("\n")
	.map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
const problems = [];
const fail = (line, message) => problems.push(`${file}:${line}: ${message}`);

let start = 0;
if (raw[0] === "---") {
	start = raw.indexOf("---", 1) + 1;
}

const lines = [];
let fence = false;
for (let i = start; i < raw.length; i++) {
	const text = raw[i];
	const n = i + 1;
	if (text.startsWith("```")) fence = !fence;
	lines.push({ n, text, code: fence });
	if (fence) continue;
	const prose = stripLinks(collapseCodeSpans(text));
	if (hasAny(prose, LONG_DASHES)) fail(n, "long dash");
	if (hasAny(prose, CURLY_QUOTES)) fail(n, "curly quote");
	if (hasMidSentenceColon(prose)) fail(n, "mid-sentence colon");
}

const h2 = (l) => (!l.code && l.text.startsWith("## ") ? l.text.slice(3).trim() : null);
const sections = [];
for (const l of lines) {
	const title = h2(l);
	if (title !== null) sections.push({ title, n: l.n, body: [] });
	else if (sections.length) sections.at(-1).body.push(l);
}
const find = (title) => sections.find((s) => s.title === title);
const bodyText = (s) => s.body.map((l) => l.text).join("\n");
const boxes = (ls) =>
	ls
		.filter((l) => !l.code)
		.map((l) => ({ n: l.n, text: boxText(l.text) }))
		.filter((b) => b.text !== null);

const h1 = lines.findIndex((l) => !l.code && l.text.startsWith("# "));
if (h1 === -1) fail(1, "no H1 title");
const howToRead = find("How to read this");
if (!howToRead) fail(1, 'no "## How to read this" section');
if (h1 !== -1 && howToRead) {
	const intro = lines.slice(h1 + 1).filter((l) => l.n < howToRead.n && l.text.trim() !== "");
	if (intro.length >= 10) fail(lines[h1].n, `intro is ${intro.length} lines, under ten required`);
	for (const marker of HOW_TO_READ_MARKERS) {
		if (!bodyText(howToRead).includes(marker)) fail(howToRead.n, `How to read this lacks "${marker}"`);
	}
}

const program = find("Program checklist");
if (!program) fail(1, 'no "## Program checklist" section');
else {
	const h3s = program.body.filter((l) => !l.code && l.text.startsWith("### ")).map((l) => l.text.slice(4).trim());
	let position = 0;
	for (const name of PROGRAM_H3) {
		const at = h3s.findIndex((t, i) => i >= position && t.startsWith(name));
		if (at === -1) fail(program.n, `Program checklist lacks "### ${name}" in order`);
		else position = at + 1;
	}
	for (const marker of PROGRAM_MARKERS) {
		if (!bodyText(program).includes(marker)) fail(program.n, `Program checklist lacks "${marker}"`);
	}
}

const close = find("Close the program");
if (!close) fail(1, 'no "## Close the program" section');
const programIndex = sections.indexOf(program);
const closeIndex = sections.indexOf(close);
const prSections = programIndex === -1 || closeIndex === -1 ? [] : sections.slice(programIndex + 1, closeIndex);
if (prSections.length === 0) fail(1, "no PR sections between Program checklist and Close the program");

const report = [];
for (const pr of prSections) {
	const heads = [];
	for (const l of pr.body) {
		if (l.code) continue;
		const lead = boldLeadIn(l.text);
		if (lead && SUB_BLOCKS.includes(lead.name)) heads.push({ name: lead.name, n: l.n, rest: lead.rest.trim(), lines: [] });
		else if (heads.length) heads.at(-1).lines.push(l);
	}
	const names = heads.map((h) => h.name);
	if (names.join("|") !== SUB_BLOCKS.join("|")) {
		fail(pr.n, `${pr.title}: sub-blocks are [${names.join(", ")}], expected [${SUB_BLOCKS.join(", ")}]`);
	}
	const block = (name) => heads.find((h) => h.name === name);
	const counts = {};
	for (const h of heads) counts[h.name] = boxes(h.lines).length;

	const depends = block("Depends on.");
	if (depends && depends.rest === "") fail(depends.n, `${pr.title}: Depends on names nothing`);
	for (const name of ["Files.", "Build.", "You see.", "Verify, unit.", "Merge."]) {
		const b = block(name);
		if (b && boxes(b.lines).length === 0) fail(b.n, `${pr.title}: ${name} has no box`);
	}
	for (const name of ["Verify, unit.", "Verify, live.", "Verify, perf."]) {
		const b = block(name);
		if (b && !b.rest.startsWith(RULE)) fail(b.n, `${pr.title}: ${name} does not open with the rule`);
	}

	const live = block("Verify, live.");
	if (live) {
		if (!namesLaneModel(live.rest)) fail(live.n, `${pr.title}: Verify, live lacks "Ten lanes on \`<swarm workers model>\` at the PR head" with the model filled in`);
		const lanes = boxes(live.lines).map((b) => ({ ...b, lane: laneNumber(b.text) }));
		const numbers = lanes.filter((b) => b.lane !== null).map((b) => b.lane).sort((a, b) => a - b);
		if (numbers.join(",") !== "1,2,3,4,5,6,7,8,9,10") fail(live.n, `${pr.title}: lanes are [${numbers.join(",")}], expected 1 to 10`);
		for (const lane of lanes) {
			if (lane.lane === null) fail(lane.n, `${pr.title}: live box is not a lane`);
			else if (!namesScreenshot(lane.text)) fail(lane.n, `${pr.title}: lane ${lane.lane} names no screenshot`);
			else if (!lane.text.includes("Pass when")) fail(lane.n, `${pr.title}: lane ${lane.lane} has no pass predicate`);
		}
	}

	const perf = block("Verify, perf.");
	if (perf) {
		const items = boxes(perf.lines).map((b) => b.text.split(" ")[0]);
		if (items.join("|") !== PERF_ITEMS.join("|")) fail(perf.n, `${pr.title}: perf boxes are [${items.join(", ")}], expected [${PERF_ITEMS.join(", ")}]`);
	}

	const gate = block("Review gate.");
	if (gate) {
		const gateBoxes = boxes(gate.lines);
		if (gate.rest.startsWith("None.")) {
			if (gateBoxes.length) fail(gate.n, `${pr.title}: Review gate says None but has boxes`);
		} else {
			const text = gate.lines.map((l) => l.text).join("\n");
			if (gateBoxes.length === 0) fail(gate.n, `${pr.title}: Review gate has no box`);
			for (const word of ["screenshot", "video", "operator"]) {
				if (!text.includes(word)) fail(gate.n, `${pr.title}: Review gate lacks "${word}"`);
			}
		}
	}

	const total = boxes(pr.body).length;
	const cells = SUB_BLOCKS.filter((s) => s !== "Depends on.").map((s) => `${slug(s)}=${counts[s] ?? 0}`);
	report.push(`${pr.title}  boxes=${total}  ${cells.join(" ")}`);
}

if (closeIndex !== -1) {
	const tail = sections.slice(closeIndex + 1);
	for (const s of tail) {
		if (!s.title.startsWith("Appendix")) fail(s.n, `"## ${s.title}" after Close the program is not an appendix`);
	}
	if (!tail.some((s) => s.title.includes("Prototype evidence"))) fail(close.n, 'no "## Appendix ... Prototype evidence" section');
}

for (const line of report) console.log(line);
console.log(`${prSections.length} PR sections, ${problems.length} problems`);
for (const p of problems) console.error(p);
process.exit(problems.length ? 1 : 0);
