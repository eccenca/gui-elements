import { Buffer } from "node:buffer";
import type { Locator, Page } from "playwright";
import { expect } from "playwright/test";

interface FileUploadScenario {
    storyId: `forms-fileupload--${string}`;
    description: string;
    run: (page: Page) => Promise<void>;
}

function uploadGroup(page: Page): Locator {
    return page.getByRole("group", { name: "Upload graph file", exact: true });
}

function browseButton(page: Page): Locator {
    return uploadGroup(page).getByRole("button", { name: /browse files$/i });
}

function fileRow(page: Page, fileName: string): Locator {
    return uploadGroup(page)
        .getByRole("listitem")
        .filter({ has: page.getByText(fileName, { exact: true }) });
}

async function testKeyboardSelection(page: Page, key: "Enter" | "Space"): Promise<void> {
    // Begin outside the controls so Tab, rather than programmatic focus, reaches Browse.
    await uploadGroup(page).focus();
    await page.keyboard.press("Tab");
    await expect(browseButton(page)).toBeFocused();

    let chooserCount = 0;
    const countChooser = () => {
        chooserCount += 1;
    };
    page.on("filechooser", countChooser);
    try {
        const chooserPromise = page.waitForEvent("filechooser");
        await page.keyboard.press(key);
        const chooser = await chooserPromise;
        await chooser.setFiles({ name: "keyboard.ttl", mimeType: "text/turtle", buffer: Buffer.from("data") });

        await expect(fileRow(page, "keyboard.ttl")).toBeVisible();
        expect(chooserCount, "Each key activation must open exactly one chooser").toBe(1);
        await expect(page.getByRole("status")).toContainText("Selected keyboard.ttl");
    } finally {
        page.off("filechooser", countChooser);
    }
}

async function testDisabledSelection(page: Page): Promise<void> {
    const browse = browseButton(page);
    await expect(browse).toBeDisabled();

    await uploadGroup(page).focus();
    await page.keyboard.press("Tab");

    await expect(browse).not.toBeFocused();
}

async function testKeyboardCancellation(page: Page): Promise<void> {
    const group = uploadGroup(page);
    await expect(fileRow(page, "graph.ttl")).toHaveAttribute("data-state", "uploading");
    await expect(group).toHaveAttribute("aria-busy", "true");

    await group.getByRole("button", { name: "Cancel upload", exact: true }).focus();
    await page.keyboard.press("Space");

    await expect(fileRow(page, "graph.ttl")).toHaveAttribute("data-state", "cancelled");
    await expect(group).not.toHaveAttribute("aria-busy");
    await expect(group.getByRole("listitem"), "Cancellation retains the file").toHaveCount(1);
    await expect(group.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Upload cancelled");
    await expect(group.getByText("Upload cancelled", { exact: true })).toBeVisible();
}

async function waitForCancelledFiles(page: Page, fileNames: readonly string[]): Promise<void> {
    // CancelledFiles.play completes the first file and stops the remaining uploads.
    await expect(fileRow(page, "first.ttl")).toHaveAttribute("data-state", "complete");
    for (const fileName of fileNames) {
        await expect(fileRow(page, fileName)).toHaveAttribute("data-state", "cancelled");
    }
    await expect(uploadGroup(page)).not.toHaveAttribute("aria-busy");
}

async function testFocusAfterRemoval(page: Page): Promise<void> {
    await waitForCancelledFiles(page, ["second.ttl", "third.ttl"]);
    const removeSecond = fileRow(page, "second.ttl").getByRole("button", { name: "Remove", exact: true });
    const removeThird = fileRow(page, "third.ttl").getByRole("button", { name: "Remove", exact: true });

    await removeSecond.focus();
    await page.keyboard.press("Enter");

    await expect(fileRow(page, "second.ttl")).toHaveCount(0);
    await expect(removeThird).toBeFocused();
    await expect(uploadGroup(page).getByRole("button", { name: "Remove", exact: true })).toHaveCount(1);
    await expect(page.getByRole("status")).toContainText("second.ttl removed");

    await page.keyboard.press("Space");

    await expect(fileRow(page, "third.ttl")).toHaveCount(0);
    await expect(browseButton(page)).toBeFocused();
    await expect(page.getByRole("status")).toContainText("third.ttl removed");
}

async function testContinueRetainedFiles(page: Page): Promise<void> {
    await waitForCancelledFiles(page, ["second.ttl"]);
    // RemovedBeforeContinue.play also removes the third file before this interaction.
    await expect(fileRow(page, "third.ttl")).toHaveCount(0);
    await expect(
        uploadGroup(page).getByRole("progressbar", { name: "Overall upload progress", exact: true }),
    ).toHaveAttribute("aria-valuenow", "50");

    await uploadGroup(page).getByRole("button", { name: "Continue uploads", exact: true }).focus();
    await page.keyboard.press("Enter");

    await expect(fileRow(page, "second.ttl")).toHaveAttribute("data-state", "uploading");
    await expect(fileRow(page, "third.ttl")).toHaveCount(0);
    await expect(uploadGroup(page).getByRole("listitem")).toHaveCount(2);
    await expect(uploadGroup(page)).toHaveAttribute("aria-busy", "true");
}

async function testRetryAfterError(page: Page): Promise<void> {
    const row = fileRow(page, "retry.ttl");
    await expect(row).toHaveAttribute("data-state", "error");
    await expect(page.getByRole("alert")).toBeVisible();

    await row.getByRole("button", { name: "Retry", exact: true }).focus();
    await page.keyboard.press("Enter");

    await expect(row).toHaveAttribute("data-state", "complete");
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByRole("status")).toContainText("retry.ttl uploaded");
    await expect(uploadGroup(page)).not.toHaveAttribute("aria-busy");
}

export const fileUploadScenarios = [
    {
        storyId: "forms-fileupload--keyboard-enter",
        description: "Enter opens one file chooser and announces the selection",
        run: (page) => testKeyboardSelection(page, "Enter"),
    },
    {
        storyId: "forms-fileupload--keyboard-space",
        description: "Space opens one file chooser and announces the selection",
        run: (page) => testKeyboardSelection(page, "Space"),
    },
    {
        storyId: "forms-fileupload--keyboard-in-dialog",
        description: "Enter opens one file chooser inside a dialog",
        run: (page) => testKeyboardSelection(page, "Enter"),
    },
    {
        storyId: "forms-fileupload--disabled",
        description: "A disabled upload control skips Browse in the tab order",
        run: testDisabledSelection,
    },
    {
        storyId: "forms-fileupload--selection-disabled",
        description: "Disabled file selection skips Browse in the tab order",
        run: testDisabledSelection,
    },
    {
        storyId: "forms-fileupload--uploading",
        description: "Space cancels an upload and retains its file",
        run: testKeyboardCancellation,
    },
    {
        storyId: "forms-fileupload--keyboard-removal",
        description: "Removing files moves focus to the next Remove button, then Browse",
        run: testFocusAfterRemoval,
    },
    {
        storyId: "forms-fileupload--removed-before-continue",
        description: "Continue resumes retained files without restoring a removed file",
        run: testContinueRetainedFiles,
    },
    {
        storyId: "forms-fileupload--retry-after-error",
        description: "Enter retries a failed upload and announces success",
        run: testRetryAfterError,
    },
] satisfies readonly FileUploadScenario[];
