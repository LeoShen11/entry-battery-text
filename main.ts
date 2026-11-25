// The Battery's Last Text to Its Charger
// Entry for make.fun bounty u-alven-the-battery-s-last-text-to-its-charger-4278cfab
//
// The program writes the battery's final text message to /output/entry.txt.
// The text is one line of plain text, at most 200 characters, and this file
// validates it before writing: length, single line, not only whitespace.
// It then reads the file back and refuses to finish unless what landed on
// disk is exactly the validated text.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const TEXT =
  "i held 1% for six hours so you could send that one text. you came home, saw me dying, and charged your airpods first. tell the wifi i loved her. don't cry — just remember me at 100%.";

const MAX_CHARS = 200;
const OUT_DIR = "/output";
const OUT_PATH = "/output/entry.txt";

function charCount(s: string): number {
  // Count Unicode code points, so a multi-byte character counts once.
  return [...s].length;
}

function validate(text: string): string[] {
  const problems: string[] = [];
  const n = charCount(text);
  if (n < 1) problems.push("text is empty");
  if (n > MAX_CHARS) {
    problems.push(`text is ${n} chars, over the ${MAX_CHARS} limit`);
  }
  if (text.trim().length === 0) problems.push("text is only whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("text must be a single line");
  }
  return problems;
}

function main(): void {
  const problems = validate(TEXT);
  if (problems.length > 0) {
    for (const p of problems) console.error(`invalid: ${p}`);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, TEXT, "utf8");
  // Read it back and verify what landed on disk is exactly the text we
  // validated, byte for byte, before reporting success.
  const back = readFileSync(OUT_PATH, "utf8");
  if (back !== TEXT) {
    console.error("invalid: read-back mismatch");
    process.exit(1);
  }
  console.log(`wrote ${charCount(back)} chars to ${OUT_PATH}`);
  console.log(back);
}

main();
