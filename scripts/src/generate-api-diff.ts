/**
 * @license
 * Copyright 2024 Daymon Littrell-Reyes
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Command } from "@commander-js/extra-typings";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { copyFile, unlink, writeFile } from "fs-extra";
import { err } from "./util";
import { promiseTry } from "./util/promises";
import { codeBlock, inlineCode } from "./util/string";

export const diffCommand = new Command("diff")
  .description("Generate a diff of the current API.")
  .argument("<input>", "Path to the current `.api.md` file.")
  .option("-o, --ouput <string>", "Save diff to an output file")
  .option(
    "--report",
    "Generate an API report, suitable for a GitHub comment, instead of a basic diff"
  )
  .action(async (input, options) => {
    if (!existsSync(input)) {
      err(`API file does not exist at path:\n${input}`);
    }

    const backup = await backupFile(input);

    console.log("Exporting new api file");

    const diff: string = await runCommand(`pnpm run api:update`)
      .then(() => generateDiff(backup, input))
      .then((diff) => (options.report ? generateReport(diff) : diff))
      .finally(() => restoreFile(backup, input));

    if (diff === "") {
      console.log("API file is up-to-date, no diff found.");
      return;
    }

    if (options.ouput) {
      await writeFile(options.ouput, diff);

      console.log(`Diff saved to ${options.ouput}`);
    } else {
      console.log(diff);
    }
  });

async function generateReport(diff: string) {
  if (diff.length === 0) return "";

  return `Your change includes changes that impact the public API.

Please run ${inlineCode("pnpm run api:update")} to update the public API file.

**API Diff**
${codeBlock(diff, "diff")}
`;
}

async function backupFile(path: string) {
  const backup = `${path}.backup`;

  return copyFile(path, backup).then(() => backup);
}

async function restoreFile(backup: string, original: string) {
  await copyFile(backup, original);
  await unlink(backup);
}

async function runCommand(command: string) {
  return promiseTry(() => execSync(command, { encoding: "utf8" }));
}

async function generateDiff(oldFile: string, newFile: string) {
  console.log("Generating diff");

  return runCommand(`git diff --no-index ${oldFile} ${newFile} || true`);
}
