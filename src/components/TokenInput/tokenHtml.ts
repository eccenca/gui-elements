export const BADGE_VALID_CLS =
    "inline-flex items-center rounded px-1.5 py-0.5 bg-info/15 text-info text-xs font-medium select-none";
export const BADGE_INVALID_CLS =
    "inline-flex items-center rounded px-1.5 py-0.5 bg-destructive/15 text-destructive text-xs font-medium select-none";
export const BADGE_BASE_CLS =
    "inline-flex items-center rounded px-1.5 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium select-none";

function escapeHtml(text: string): string {
    // `"` is escaped because this output is interpolated into double-quoted HTML
    // attributes (data-base in toHtml), not just text content.
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Short label for a field reference: its last dotted segment with any trailing
// `[]` dropped, matching how target-form derives palette names
// (`path.split(".").pop().replace(/\[\]$/, "")`).
function fieldShortLabel(name: string): string {
    return (name.split(".").pop() ?? name).replace(/\[\]$/, "");
}

// A field token is valid if its exact name — or its short label — is a known
// source field. The chip renders the short label, but AI-authored rules may
// reference the full path (e.g. `{descriptions[].lang}`), so both forms must
// colour as valid.
export function isFieldValid(name: string, validNames: Set<string>): boolean {
    return validNames.has(name) || validNames.has(fieldShortLabel(name));
}

export function isBaseStripped(value: string, baseChip?: string, staticBase?: boolean): boolean {
    return !!(staticBase && baseChip && typeof value === "string" && value.startsWith(baseChip));
}

// Trailing zero-width space = an editable node so the caret can sit right after
// the chip; a contenteditable=false span otherwise has no caret position after
// it, so text can't be typed after an inserted chip. fromDiv() strips it, so the
// serialized value is unaffected.
const ZWS = "​";

export function toHtml(
    value: string,
    validNames: string[],
    baseChip?: string,
    staticBase?: boolean,
    baseLabel: string = "baseIRI",
): string {
    const validSet = new Set(validNames);
    let safe = typeof value === "string" ? value : "";
    // With `staticBase` a leading base lives in a badge rendered outside the
    // editable area (see render), so strip it here and emit no inline chip.
    if (staticBase && baseChip && safe.startsWith(baseChip)) {
        safe = safe.slice(baseChip.length);
    }
    // Tokenize the body into field chips (`{…}`, dotted paths allowed) and inline
    // baseIRI chips (the base literal wherever it appears, not just leading).
    const splitter = baseChip ? new RegExp(`(${escapeRegExp(baseChip)}|\\{[^{}]+\\})`) : /(\{[^{}]+\})/;
    return safe
        .split(splitter)
        .map((part) => {
            if (!part) return "";
            if (baseChip && part === baseChip) {
                return `<span contenteditable="false" data-base="${escapeHtml(baseChip)}" class="${BADGE_BASE_CLS}">${escapeHtml(baseLabel)}</span>${ZWS}`;
            }
            const match = part.match(/^\{([^{}]+)\}$/);
            if (match) {
                const name = match[1];
                const cls = isFieldValid(name, validSet) ? BADGE_VALID_CLS : BADGE_INVALID_CLS;
                // Display the short label (matching the palette chips) but keep the full
                // path in data-field so fromDiv round-trips it losslessly.
                return `<span contenteditable="false" data-field="${escapeHtml(name)}" class="${cls}">${escapeHtml(fieldShortLabel(name))}</span>${ZWS}`;
            }
            return escapeHtml(part);
        })
        .join("");
}

export function fromDiv(el: HTMLElement): string {
    let result = "";
    for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            result += (node.textContent ?? "").replace(/\u200B/g, "");
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const elem = node as HTMLElement;
            const base = elem.getAttribute("data-base");
            const field = elem.getAttribute("data-field");
            if (base !== null) {
                result += base;
            } else if (field) {
                result += `{${field}}`;
            } else {
                result += fromDiv(elem);
            }
        }
    }
    return result;
}
