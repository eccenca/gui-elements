import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const base = compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
);

export default [{
    // Vendored shadcn/ui primitives — managed by the shadcn CLI, NOT autofixed/reformatted by
    // repo tooling. Global ignore keeps them byte-for-byte matched to CLI output so `shadcn:drift`
    // can detect real changes instead of drowning them in lint reformatting. The rest of
    // `src/_shadcn/` (index.ts, lib/, hooks/) stays linted. See src/_shadcn/index.ts for policy.
    ignores: ["src/_shadcn/ui/**"],
}, ...base, {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        react,
        "react-hooks": fixupPluginRules(reactHooks),
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        parser: tsParser,
        globals: {
            window: "readonly",
        }
    },

    rules: {
        "arrow-body-style": "off",
        "prefer-arrow-callback": "off",

        "simple-import-sort/imports": ["error", {
            groups: [
                ["^react", "^@?\\w"],
                ["^(@|components)(/.*|$)"],
                ["^\\u0000"],
                ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                ["^.+\\.?(css)$"],
            ],
        }],

        "@typescript-eslint/ban-ts-comment": ["error", {
            "ts-ignore": "allow-with-description",
        }],

        "no-console": ["error", { allow: ["warn", "error"] }],

        // Deliberate escape hatch in generic component APIs; keep visible but non-blocking.
        "@typescript-eslint/no-explicit-any": "warn",

        "@typescript-eslint/no-unused-vars": ["error", {
            args: "after-used",
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrors: "none",
            ignoreRestSiblings: true,
        }],

        // `T = {}` generic defaults are part of the (Blueprint-derived) public Tree API.
        "@typescript-eslint/no-empty-object-type": ["error", { allowObjectTypes: "always" }],

        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": ["error", {
            allowShortCircuit: true,
            allowTernary: true,
        }],
    },
},
{
    // Node-context tooling and test setup (CommonJS / process scripts).
    files: [".storybook/**/*.js", "scripts/**/*.{js,mjs}", "src/test/**/*.js"],
    languageOptions: {
        globals: {
            require: "readonly",
            module: "writable",
            process: "readonly",
            console: "readonly",
            __dirname: "readonly",
            global: "writable",
            window: "readonly",
            document: "readonly",
            Element: "readonly",
            MouseEvent: "readonly",
        },
    },
    rules: {
        "@typescript-eslint/no-require-imports": "off",
        "no-console": "off",
    },
},
{
    // Jest suites and Storybook stories may use require() (dynamic story collection)
    // and console (story event logging).
    files: ["**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}"],
    rules: {
        "@typescript-eslint/no-require-imports": "off",
        "no-console": "off",
    },
}];
