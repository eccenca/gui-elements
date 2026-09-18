import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

import { fileUploadScenarios } from "../.storybook/tests/file-upload.mts";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const urlIndex = args.indexOf("--url");
const url = urlIndex < 0 ? "http://127.0.0.1:6006" : args[urlIndex + 1];
if (!url?.trim() || url.startsWith("-")) {
    throw new Error("--url requires a URL value");
}
const runner = resolve(dirname(require.resolve("@storybook/test-runner/package.json")), "dist/test-storybook.js");
const child = spawn(
    process.execPath,
    [runner, "--index-json", "--includeTags", "browser-test", "--browsers", "chromium", "--maxWorkers", "1", ...args],
    { cwd: root, stdio: "inherit" },
);
const stop = () => child.kill("SIGTERM");
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
let code: number;
try {
    code = await new Promise<number>((done, reject) => {
        child.once("error", reject);
        child.once("exit", (status) => done(status ?? 1));
    });
} finally {
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
}
if (code !== 0) process.exitCode = code;
else {
    const browser = await chromium.launch();
    try {
        for (const scenario of fileUploadScenarios) {
            const page = await browser.newPage();
            page.setDefaultTimeout(10_000);
            try {
                await page.goto(`${url}/iframe.html?id=${scenario.storyId}&viewMode=story`);
                await scenario.run(page);
            } catch (error) {
                throw new Error(`Native browser test failed: ${scenario.description} (${scenario.storyId})`, {
                    cause: error,
                });
            } finally {
                await page.close();
            }
        }
        process.stdout.write(`Passed ${fileUploadScenarios.length} native FileUpload keyboard/focus tests.\n`);
    } finally {
        await browser.close();
    }
}
