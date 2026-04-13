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

export default [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        react,
        "react-hooks": fixupPluginRules(reactHooks),
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        parser: tsParser,
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

        "no-console": "error",
    },
}];