/* eslint-disable no-console, no-undef -- build script running in node, not in the browser */
/**
 * Repairs module references that `tsc-esm-fix` rewrote into unresolvable ones.
 *
 * `tsc-esm-fix` appends `.js` to every module reference it can map to a file inside
 * `node_modules`, including bare imports into packages whose `exports` map only exposes
 * the extension-less subpath. `@codemirror/legacy-modes` for example declares
 * `"./mode/*": { "import": "./mode/*.js" }`, so the rewritten `@codemirror/legacy-modes/mode/jinja2.js`
 * expands to `mode/jinja2.js.js` and neither Node nor a bundler can resolve it.
 *
 * Every bare import in the ESM output is checked here: when it does not point to an
 * existing file but its extension-less form does, the added extension is removed again.
 *
 * The references are collected by the TypeScript scanner instead of a regular expression, so
 * that all import forms are covered (including side effect only imports like `import "…";`)
 * and no comment, string literal or regular expression that happens to contain something like
 * `from "…"` is mistaken for a module reference.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const target = process.argv[2] ?? "dist/esm";

// `import.meta.resolve` only returns a string synchronously since node 18.19/20.0, before that it
// was hidden behind `--experimental-import-meta-resolve` and answered with a promise. Without this
// check every lookup below would just fail, no reference would be repaired and the build would
// still be reported as successful while shipping unresolvable imports.
if (typeof import.meta.resolve !== "function") {
    throw new Error(
        `fix-esm-imports: this script needs a synchronous "import.meta.resolve", available since node 18.19.0, but runs on ${process.version}`,
    );
}

/** error codes of node's module resolution that really mean "there is nothing to import here" */
const unresolvableCodes = new Set([
    "ERR_MODULE_NOT_FOUND",
    "ERR_PACKAGE_PATH_NOT_EXPORTED",
    "ERR_PACKAGE_IMPORT_NOT_DEFINED",
    "ERR_UNSUPPORTED_DIR_IMPORT",
    "ERR_UNSUPPORTED_ESM_URL_SCHEME",
    "ERR_INVALID_MODULE_SPECIFIER",
    "ERR_INVALID_PACKAGE_CONFIG",
    "ERR_INVALID_PACKAGE_TARGET",
]);

/**
 * Only bare references can be checked here, relative ones are resolved against the output
 * directory and references using a URL scheme (`node:`, `data:`, `http:`, …) never address a
 * package sub path.
 */
const isBareSpecifier = (specifier) =>
    !specifier.startsWith(".") && !specifier.startsWith("/") && !/^\w[\w+.-]*:/.test(specifier);

const collectFiles = (directory) =>
    fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return collectFiles(entryPath);
        return entry.name.endsWith(".js") ? [entryPath] : [];
    });

const resolvesToFile = (specifier) => {
    let resolved;
    try {
        resolved = import.meta.resolve(specifier);
    } catch (error) {
        // only a failed resolution is an expected answer, everything else (a broken resolver, a
        // permission problem, …) has to abort the build instead of silently repairing nothing
        if (unresolvableCodes.has(error?.code)) return false;
        throw error;
    }
    return fs.existsSync(fileURLToPath(resolved));
};

const replacements = new Map();

/** @returns the specifier that should be used instead, or `undefined` to keep it as it is */
const repairedSpecifier = (specifier) => {
    if (!replacements.has(specifier)) {
        const withoutExtension = specifier.replace(/\.js$/, "");
        const repairable =
            isBareSpecifier(specifier) &&
            specifier !== withoutExtension &&
            !resolvesToFile(specifier) &&
            resolvesToFile(withoutExtension);
        replacements.set(specifier, repairable ? withoutExtension : undefined);
    }
    return replacements.get(specifier);
};

/** @returns the module references of the given source, the last one in the file first */
const moduleReferences = (contents) =>
    [...ts.preProcessFile(contents, true, true).importedFiles].sort((one, other) => other.pos - one.pos);

let repaired = 0;

for (const file of collectFiles(target)) {
    const contents = fs.readFileSync(file, "utf8");
    let fixedContents = contents;
    // the references are replaced from the end of the file to its beginning, this way the
    // positions of all not yet handled ones stay valid
    for (const reference of moduleReferences(contents)) {
        const specifier = reference.fileName;
        const replacement = repairedSpecifier(specifier);
        if (replacement === undefined) continue;
        // `pos` addresses the quote opening the reference, its text starts behind it
        const start = reference.pos + 1;
        if (fixedContents.slice(start, start + specifier.length) !== specifier) {
            throw new Error(
                `fix-esm-imports: cannot repair "${specifier}" in ${file}, the source at position ${start} does not match the parsed reference`,
            );
        }
        fixedContents = fixedContents.slice(0, start) + replacement + fixedContents.slice(start + specifier.length);
    }
    if (fixedContents !== contents) {
        fs.writeFileSync(file, fixedContents);
        repaired += 1;
    }
}

for (const [specifier, replacement] of replacements) {
    if (replacement !== undefined) {
        console.log(`fix-esm-imports: "${specifier}" -> "${replacement}"`);
    }
}
console.log(`fix-esm-imports: repaired imports in ${repaired} file(s) of ${target}`);
