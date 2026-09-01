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
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const target = process.argv[2] ?? "dist/esm";

/** matches the specifier of static imports/re-exports and dynamic imports */
const specifiers = /(?:\bfrom\s*|\bimport\s*\(\s*)(["'])([^"']+)\1/g;

const collectFiles = (directory) =>
    fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return collectFiles(entryPath);
        return entry.name.endsWith(".js") ? [entryPath] : [];
    });

const resolvesToFile = (specifier) => {
    try {
        return fs.existsSync(fileURLToPath(import.meta.resolve(specifier)));
    } catch {
        return false;
    }
};

const replacements = new Map();

/** @returns the specifier that should be used instead, or `undefined` to keep it as it is */
const repairedSpecifier = (specifier) => {
    if (!replacements.has(specifier)) {
        const withoutExtension = specifier.replace(/\.js$/, "");
        const repairable =
            specifier !== withoutExtension && !resolvesToFile(specifier) && resolvesToFile(withoutExtension);
        replacements.set(specifier, repairable ? withoutExtension : undefined);
    }
    return replacements.get(specifier);
};

let repaired = 0;

for (const file of collectFiles(target)) {
    const contents = fs.readFileSync(file, "utf8");
    const fixedContents = contents.replace(specifiers, (reference, quote, specifier) => {
        // relative references are resolved against the output directory, only bare ones can be checked here
        if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("node:")) return reference;
        const replacement = repairedSpecifier(specifier);
        return replacement === undefined ? reference : reference.replace(specifier, replacement);
    });
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
