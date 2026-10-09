import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

const runner = fileURLToPath(new URL("../../scripts/run-storybook-tests.mts", import.meta.url));

const invalidArgs = [["--url"], ["--url", ""], ["--url", "--ci"]];
for (const args of invalidArgs) {
    const result = spawnSync(process.execPath, [runner, ...args], { encoding: "utf8", timeout: 10_000 });

    assert.ifError(result.error);
    assert.equal(result.status, 1, `Expected rejection of ${JSON.stringify(args)}`);
    assert.match(result.stderr, /--url requires a URL value/);
}
process.stdout.write(`Passed ${invalidArgs.length} Storybook runner argument checks.\n`);
