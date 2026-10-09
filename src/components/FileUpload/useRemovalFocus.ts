import React from "react";

import { UploadRow } from "./UploadController";

/**
 * Keep focus within the uploader when a visible Remove action deletes its own button.
 * After React updates the DOM, prefer the next Remove button, then the closest previous one,
 * then enabled Browse, and finally the widget itself.
 *
 * @param files Current rows in display order; only cancelled rows have Remove buttons.
 * @param removeFile Removes the selected row from the upload controller.
 * @returns Refs for the group and Browse button, a Remove-button ref registry, and removeRow
 * for visible Remove actions. Attach groupRef to an element with tabIndex={-1} for the final fallback.
 */
export function useRemovalFocus(files: readonly UploadRow[], removeFile: (fileId: string) => void) {
    const groupRef = React.useRef<HTMLDivElement>(null);
    const browseRef = React.useRef<HTMLButtonElement>(null);
    const removeRefs = React.useRef(new Map<string, HTMLButtonElement | HTMLAnchorElement>());
    const pendingFocusIds = React.useRef<string[]>();

    React.useEffect(() => {
        if (!pendingFocusIds.current) return;
        // Wait for the updated DOM refs: focus the next Remove, then the closest previous Remove,
        // then Browse. The group remains focusable when selection is disabled.
        const nextRemoveButton = pendingFocusIds.current.map((id) => removeRefs.current.get(id)).find(Boolean);
        pendingFocusIds.current = undefined;
        const browseButton = browseRef.current;
        const fallbackFocusTarget = browseButton && !browseButton.disabled ? browseButton : groupRef.current;
        (nextRemoveButton ?? fallbackFocusTarget)?.focus();
    }, [files]);

    const registerRemoveButton = (fileId: string, element: HTMLButtonElement | HTMLAnchorElement | null) => {
        if (element) removeRefs.current.set(fileId, element);
        else removeRefs.current.delete(fileId);
    };

    const removeRow = (fileId: string) => {
        const removableIds = files.filter((row) => row.status === "cancelled").map((row) => row.file.id);
        const index = removableIds.indexOf(fileId);
        const followingRemovableIds = removableIds.slice(index + 1);
        const precedingRemovableIds = removableIds.slice(0, index).reverse();
        pendingFocusIds.current = [...followingRemovableIds, ...precedingRemovableIds];
        removeFile(fileId);
    };

    return { groupRef, browseRef, registerRemoveButton, removeRow };
}
