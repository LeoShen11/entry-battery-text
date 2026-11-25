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
  "i held on at 1% for six hours so you could send that one last text. you came home, saw me dying, and charged your airpods first. tell the wifi i loved her. don't cry — just remember me at 100%.";

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
  // Each failure case gets its own distinct message so a rejected draft
  // says exactly which rule it broke.
  if (n === 0) {
    problems.push("empty text: the battery sent nothing at all");
  } else if (text.trim().length === 0) {
    problems.push(
      `whitespace-only text: ${n} char(s) but none of them say anything`
    );
  }
  if (n > MAX_CHARS) {
    problems.push(
      `too long: ${n} chars is ${n - MAX_CHARS} over the ${MAX_CHARS}-char limit`
    );
  }
  if (text.endsWith("\n") || text.endsWith("\r")) {
    problems.push("trailing newline: the text must end on its last word");
  } else if (text.includes("\n") || text.includes("\r")) {
    problems.push("multi-line text: line breaks are not allowed");
  }
  if (text !== text.trim()) {
    problems.push("padded text: no leading or trailing spaces allowed");
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
  const expected = Buffer.from(TEXT, "utf8");
  writeFileSync(OUT_PATH, expected);
  // Read it back as raw bytes and demand a byte-exact match with what we
  // meant to write — a string compare alone could hide an encoding slip.
  const onDisk = readFileSync(OUT_PATH);
  if (!onDisk.equals(expected)) {
    console.error(
      `invalid: read-back mismatch (disk has ${onDisk.length} bytes, expected ${expected.length})`
    );
    process.exit(1);
  }
  const back = onDisk.toString("utf8");
  if (back !== TEXT || back.includes("\n") || back.includes("\r")) {
    console.error("invalid: read-back text differs from the validated text");
    process.exit(1);
  }
  console.log(
    `verified ${OUT_PATH}: ${charCount(back)} chars, ${onDisk.length} bytes, byte-exact match`
  );
  console.log(back);
}

main();
