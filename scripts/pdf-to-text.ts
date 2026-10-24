// scripts/pdf-to-text.ts
// Run from the scripts/ folder:
//   npx tsx pdf-to-text.ts ~/Downloads/WP140_web.pdf ~/Downloads/wp140.txt
// Extracts the text of a PDF into a .txt file (not committed to the repo).

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// Import the library file directly: the package's index.js runs a test file when imported as a module.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require("pdf-parse/lib/pdf-parse.js");

const expand = (p: string) => (p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p);

async function main() {
  const [inArg, outArg] = process.argv.slice(2);
  if (!inArg || !outArg) {
    console.error("Usage: npx tsx pdf-to-text.ts <input.pdf> <output.txt>");
    process.exit(1);
  }
  const input = expand(inArg);
  const output = expand(outArg);

  const data = await pdf(await readFile(input));
  await writeFile(output, data.text);
  console.log(`Read ${data.numpages} pages, wrote ${data.text.length} characters to ${output}`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
