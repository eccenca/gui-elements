/**
 * Story smoke test + coverage guard.
 *
 * 1. Renders every story of every `*.stories.tsx` under `src/` once in jsdom (via
 *    `composeStories`, so decorators/args from the story files and `.storybook/preview.js`
 *    apply). A story that throws during render fails the suite with its file and story name.
 * 2. Asserts that every public component directory under `src/components/{atoms,molecules,
 *    organisms}` ships at least one story, so new components cannot land without one.
 */
import * as fs from "fs";
import * as path from "path";
import React from "react";
import { cleanup, render } from "@testing-library/react";
import { composeStories, setProjectAnnotations } from "@storybook/react";

import * as projectAnnotations from "../../.storybook/preview";

setProjectAnnotations([projectAnnotations]);

const SRC_DIR = path.resolve(__dirname, "..");

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

const storyFiles = collectFiles(SRC_DIR, isStoryFile);

describe("story smoke test", () => {
    it("finds story files", () => {
        expect(storyFiles.length).toBeGreaterThan(100);
    });

    describe.each(storyFiles.map((file) => [path.relative(SRC_DIR, file), file]))(
        "%s",
        (_relativePath: string, absolutePath: string) => {
            let composed: Record<string, React.ComponentType> = {};
            let loadError: unknown;
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const storyModule = require(absolutePath);
                composed = composeStories(storyModule) as unknown as Record<string, React.ComponentType>;
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
                it.each(storyNames)("renders story %s", (storyName: string) => {
                    const Story = composed[storyName];
                    try {
                        render(<Story />);
                    } finally {
                        cleanup();
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
});
