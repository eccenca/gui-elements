/**
 * Story smoke test + coverage guard.
 *
 * 1. Renders every story of every `*.stories.tsx` under `src/` once in jsdom (via
 *    `composeStories`, so decorators/args from the story files and `.storybook/preview.js`
 *    apply). A story that throws during render fails the suite with its file and story name.
 *    After render the story's `play` function (if any) is awaited so interaction tests run in
 *    CI just like they would in the Storybook test runner. Every story is exercised twice —
 *    once in the default (light) theme and once with the `dark` class set on the root element —
 *    to catch dark-only CSS/JS branches.
 * 2. Asserts that every public component directory ships at least one story, so new components
 *    cannot land without one. This covers `src/components/{atoms,molecules,organisms}` as well
 *    as the `src/cmem` and `src/extensions` roots (any directory that directly holds a
 *    non-story, non-test `*.tsx` component file). A small, explicit allowlist pins the handful
 *    of directories that are deliberately storyless today; the allowlist is itself asserted to
 *    stay honest (no stale or already-covered entries).
 */
import React from "react";
import { composeStories, setProjectAnnotations } from "@storybook/react";
import { cleanup, render } from "@testing-library/react";
import * as fs from "fs";
import * as path from "path";

import * as projectAnnotations from "../../.storybook/preview";

setProjectAnnotations([projectAnnotations]);

const SRC_DIR = path.resolve(__dirname, "..");

/** A composed story is a render-able component that may carry a Storybook `play` function. */
type ComposedStory = React.ComponentType & {
    play?: (context: { canvasElement: HTMLElement }) => void | Promise<void>;
};

/** Recursively collect files below `dir` matching `matcher`, as absolute paths. */
const collectFiles = (dir: string, matcher: (fileName: string) => boolean): string[] => {
    const collected: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const absolute = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collected.push(...collectFiles(absolute, matcher));
        } else if (matcher(entry.name)) {
            collected.push(absolute);
        }
    }
    return collected;
};

const isStoryFile = (fileName: string) => /\.stories\.(js|jsx|ts|tsx)$/.test(fileName);
const isTestFile = (fileName: string) => /\.(test|spec)\.(js|jsx|ts|tsx)$/.test(fileName);
/** A component file: a `.tsx` module that is neither a story nor a test. */
const isComponentFile = (fileName: string) =>
    /\.tsx$/.test(fileName) && !isStoryFile(fileName) && !isTestFile(fileName);

const storyFiles = collectFiles(SRC_DIR, isStoryFile);

const THEME_MODES = ["light", "dark"] as const;

/** Toggle the `dark` class on the root element the way the Tailwind/next-themes stack expects. */
const applyThemeMode = (mode: (typeof THEME_MODES)[number]) => {
    if (mode === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
};

describe("story smoke test", () => {
    afterEach(() => {
        cleanup();
        document.documentElement.classList.remove("dark");
    });

    it("finds story files", () => {
        expect(storyFiles.length).toBeGreaterThan(100);
    });

    describe.each(storyFiles.map((file) => [path.relative(SRC_DIR, file), file]))(
        "%s",
        (_relativePath: string, absolutePath: string) => {
            let composed: Record<string, ComposedStory> = {};
            let loadError: unknown;
            try {
                const storyModule = require(absolutePath);
                composed = composeStories(storyModule) as unknown as Record<string, ComposedStory>;
            } catch (error) {
                loadError = error;
            }
            const storyNames = Object.keys(composed);

            it("loads and exports at least one story", () => {
                if (loadError) {
                    throw loadError;
                }
                expect(storyNames.length).toBeGreaterThan(0);
            });

            if (storyNames.length > 0) {
                // A single test per story runs both theme modes so `play` interactions and
                // dark-only branches are exercised without doubling the number of test cases.
                it.each(storyNames)("renders story %s (light + dark)", async (storyName: string) => {
                    const Story = composed[storyName];
                    for (const mode of THEME_MODES) {
                        applyThemeMode(mode);
                        try {
                            const { container } = render(<Story />);
                            await Story.play?.({ canvasElement: container });
                        } finally {
                            cleanup();
                            document.documentElement.classList.remove("dark");
                        }
                    }
                });
            }
        },
    );
});

describe("story coverage guard", () => {
    const TIERS = ["atoms", "molecules", "organisms"];

    it.each(TIERS)("every %s component has at least one story", (tier: string) => {
        const tierDir = path.join(SRC_DIR, "components", tier);
        const componentDirs = fs
            .readdirSync(tierDir, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
        const componentsWithoutStory = componentDirs.filter(
            (componentDir) => collectFiles(path.join(tierDir, componentDir), isStoryFile).length === 0,
        );
        expect(componentsWithoutStory).toEqual([]);
    });

    // --- cmem / extensions roots -----------------------------------------------------------
    // These roots are nested (unlike the flat atoms/molecules/organisms tiers), so we treat any
    // directory that DIRECTLY holds a non-story, non-test `*.tsx` file as a component directory
    // and require a story somewhere in its subtree. Directories listed here are the ones that are
    // intentionally storyless today (react-flow node/marker/menu primitives that only render
    // meaningfully inside a live flow/editor context). Shrink this list — do not grow it — when a
    // story is added; a new widget landing storyless must add a story, not an allowlist entry.
    const STORYLESS_ALLOWLIST = [
        // FIXME(StickyNoteModal): crashes when the "stickynotes" CSS color config scrapes empty
        // (jsdom / CORS-blocked / async-CSS races) — see StickyNoteModal.test.tsx test.failing.
        // Kept storyless until the noteColors[0] crash is fixed; then add a story and drop this.
        "cmem/react-flow/StickyNoteModal",
        "cmem/react-flow/nodes", // StickyNoteNode — only renders inside a ReactFlow canvas
        "extensions/codemirror/toolbars", // editor toolbar menus — exercised via CodeMirror stories
        "extensions/react-flow/markers", // SVG <marker> defs — only meaningful inside a flow
    ];

    /** All component directories (see above) under `root`, as paths relative to SRC_DIR. */
    const componentDirsUnder = (root: string): string[] => {
        const rootDir = path.join(SRC_DIR, root);
        const dirs: string[] = [];
        const walk = (dir: string) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory() && entry.name !== "tests" && entry.name !== "stories") {
                    walk(path.join(dir, entry.name));
                }
            }
            if (entries.some((entry) => entry.isFile() && isComponentFile(entry.name))) {
                dirs.push(path.relative(SRC_DIR, dir));
            }
        };
        walk(rootDir);
        return dirs;
    };

    const hasStoryInSubtree = (relativeDir: string) =>
        collectFiles(path.join(SRC_DIR, relativeDir), isStoryFile).length > 0;

    it("every cmem/extensions component directory has a story (or is explicitly allowlisted)", () => {
        const componentDirs = [...componentDirsUnder("cmem"), ...componentDirsUnder("extensions")];
        const missing = componentDirs
            .filter((dir) => !hasStoryInSubtree(dir))
            .filter((dir) => !STORYLESS_ALLOWLIST.includes(dir));
        expect(missing).toEqual([]);
    });

    it("the storyless allowlist has no stale or already-covered entries", () => {
        const componentDirs = new Set([...componentDirsUnder("cmem"), ...componentDirsUnder("extensions")]);
        const stale = STORYLESS_ALLOWLIST.filter(
            // entry no longer a component directory, or it now ships a story
            (dir) => !componentDirs.has(dir) || hasStoryInSubtree(dir),
        );
        expect(stale).toEqual([]);
    });
});
