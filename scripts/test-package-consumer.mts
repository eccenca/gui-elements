import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--check-dependencies")) {
    throw new Error("Usage: test-package-consumer.mts [--check-dependencies]");
}
const checkDependencies = args.includes("--check-dependencies");

function run(command: string, args: string[], cwd: string): void {
    const result = spawnSync(command, args, { cwd, stdio: "inherit" });
    if (result.error) throw result.error;
    if (result.status !== 0) {
        throw new Error(`${command} ${args.join(" ")} failed (${result.signal ?? result.status})`);
    }
}

const started = performance.now();
await mkdir(path.join(root, ".local"), { recursive: true });
const directory = await mkdtemp(path.join(root, ".local/package-consumer-"));

try {
    await cp(path.join(root, "tests/package-consumer"), directory, { recursive: true });
    const archive = path.join(directory, "gui-elements.tgz");
    run("yarn", ["pack", "--filename", archive], root);
    const installedPackage = path.join(directory, "node_modules/@eccenca/gui-elements");
    await mkdir(installedPackage, { recursive: true });
    run("tar", ["-xzf", archive, "--strip-components=1", "-C", installedPackage], directory);

    // Reuse installed dependencies, but resolve gui-elements from the extracted package.
    for (const mode of ["bundler", "node16", "nodenext"]) {
        console.info(`Checking package types with ${mode} resolution`);
        run(
            process.execPath,
            [
                require.resolve("typescript/bin/tsc"),
                "-p",
                `tsconfig.${mode}.json`,
                ...(checkDependencies ? ["--skipLibCheck", "false"] : []),
            ],
            directory,
        );
    }
    for (const script of ["test-package-exports-esm.mjs", "test-package-exports-commonjs.cjs"]) {
        await cp(path.join(root, "scripts", script), path.join(directory, script));
        console.info(`Running ${script} against the packed package`);
        run(process.execPath, [script], directory);
    }
    console.info(`Package consumer checks passed in ${((performance.now() - started) / 1000).toFixed(1)}s`);
} finally {
    await rm(directory, { recursive: true, force: true });
}
