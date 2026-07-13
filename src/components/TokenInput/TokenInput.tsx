import { ChevronDown } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "../../_shadcn/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../_shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../_shadcn/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../_shadcn/ui/tooltip";
import { cn } from "../../common/utils/cn";

import {
    BADGE_BASE_CLS,
    BADGE_INVALID_CLS,
    BADGE_VALID_CLS,
    fromDiv,
    isBaseStripped,
    isFieldValid,
    toHtml,
} from "./tokenHtml";

/**
 * User-facing strings of the TokenInput. All default to English; pass
 * translations to localize (the library itself is i18n-free by convention).
 */
export interface TokenInputLabels {
    /** Short label rendered inside the base-prefix chip/badge. */
    baseLabel?: string;
    /** Hint preceding the clickable token palette (`tokensAs="chips"`). */
    clickTokenHint?: string;
    /** Title of a palette chip (inserts the token at the caret). */
    insertTitle?: string;
    /** Aria label of a palette chip's remove ("×") button. */
    removeTokenAriaLabel?: (name: string) => string;
    /** Title of a palette chip's remove ("×") button. */
    removeTokenTitle?: string;
    /** Trigger text of the insert combobox (`tokensAs="combobox"`). */
    insertComboboxPlaceholder?: string;
    /** Placeholder of the combobox search input. */
    searchPlaceholder?: string;
    /** Empty state of the combobox search. */
    noMatches?: string;
}

const DEFAULT_LABELS: Required<TokenInputLabels> = {
    baseLabel: "base",
    clickTokenHint: "Click a field to insert it:",
    insertTitle: "Insert",
    removeTokenAriaLabel: (name: string) => `Remove field ${name}`,
    removeTokenTitle: "Remove field",
    insertComboboxPlaceholder: "Insert field…",
    searchPlaceholder: "Search fields…",
    noMatches: "No fields match.",
};

export interface TokenInputProps {
    /** Serialized value: plain text with `{token}` references (and optionally a base prefix). */
    value: string;
    onChange: (v: string) => void;
    onFocus?: () => void;
    /** Known token names; matching `{token}` chips render as valid, others as invalid. */
    fieldNames: string[];
    placeholder?: string;
    /** Extra control rendered to the right of the editable field (e.g. a generate button). */
    action?: React.ReactNode;
    /** Extra control rendered right-aligned in the palette row. */
    fieldsAction?: React.ReactNode;
    /** How insertable tokens are offered: a clickable chip palette or a searchable combobox. */
    tokensAs?: "chips" | "combobox";
    /**
     * When set, a leading occurrence of this string is treated as a base
     * prefix. By default it renders as an inline (deletable) chip inside the
     * editable text; with `staticBase`, it becomes a fixed, non-editable badge
     * shown to the left of the field (outside the editable text) and is always
     * prepended on serialization.
     */
    baseChip?: string;
    /**
     * Render `baseChip` as a static prefix badge outside the editable area rather
     * than as an inline, removable chip. The badge can't be edited or deleted; the
     * base is always prepended to the serialized value.
     */
    staticBase?: boolean;
    /**
     * When set, each token chip in the palette gets an "×" that calls this
     * with the token name, letting the caller drop that token.
     */
    onRemoveField?: (name: string) => void;
    /** Extra controls rendered inline in the chip row (e.g. an "add token" picker). */
    extraControls?: React.ReactNode;
    /** Overridable user-facing strings (English defaults). */
    labels?: TokenInputLabels;
}

/**
 * A contenteditable input mixing free text with atomic `{token}` chips — for
 * template/pattern editing (e.g. URI patterns built from source fields).
 * Tokens insert at the caret from a chip palette or combobox, render with
 * valid/invalid styling against `fieldNames`, and round-trip losslessly
 * through the serialized `value`.
 */
export function TokenInput({
    value,
    onChange,
    onFocus,
    fieldNames,
    placeholder,
    action,
    fieldsAction,
    tokensAs = "chips",
    baseChip,
    staticBase,
    onRemoveField,
    extraControls,
    labels,
}: TokenInputProps) {
    const l = { ...DEFAULT_LABELS, ...labels };
    const baseLabel = l.baseLabel;
    const [comboboxOpen, setComboboxOpen] = useState(false);
    // Bounding rect of the inline base chip while hovered, used to anchor a tooltip
    // over it — the chip is raw HTML inside the contentEditable area, so it can't be
    // a React TooltipTrigger directly.
    const [baseAnchor, setBaseAnchor] = useState<DOMRect | null>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const lastInternalRef = useRef<string>(value);
    // Whether the base prefix is currently stripped into the outside badge. Gated on
    // the rendered value actually starting with the base, so handleInput only
    // re-prepends the base when toHtml stripped it (a value that doesn't start with
    // the base stays whole in the editable body and must not get the base prepended).
    const baseStrippedRef = useRef<boolean>(isBaseStripped(value, baseChip, staticBase));
    const [baseActive, setBaseActive] = useState<boolean>(baseStrippedRef.current);

    const renderHtml = useCallback(
        (v: string) => {
            const stripped = isBaseStripped(v, baseChip, staticBase);
            baseStrippedRef.current = stripped;
            setBaseActive(stripped);
            return toHtml(v, fieldNames, baseChip, staticBase, baseLabel);
        },
        [fieldNames, baseChip, staticBase, baseLabel],
    );

    // Set initial HTML on mount
    useEffect(() => {
        if (!divRef.current) return;
        divRef.current.innerHTML = renderHtml(value);
        lastInternalRef.current = value;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Only reset innerHTML if value changed externally
    useEffect(() => {
        if (!divRef.current) return;
        if (value === lastInternalRef.current) return;
        lastInternalRef.current = value;
        divRef.current.innerHTML = renderHtml(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Re-render the body when the base prefix arrives/changes (e.g. a base URI
    // loading after mount), since it's stripped from the editable text.
    const baseSeeded = useRef(true);
    useEffect(() => {
        if (baseSeeded.current) {
            baseSeeded.current = false;
            return;
        }
        if (!divRef.current) return;
        lastInternalRef.current = value;
        divRef.current.innerHTML = renderHtml(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseChip, staticBase]);

    const fieldNamesKey = useMemo(() => fieldNames.slice().sort().join("|"), [fieldNames]);

    // Update validity classes without touching cursor
    useEffect(() => {
        if (!divRef.current) return;
        const validSet = new Set(fieldNamesKey ? fieldNamesKey.split("|") : []);
        divRef.current.querySelectorAll<HTMLElement>("[data-field]").forEach((span) => {
            const name = span.getAttribute("data-field") ?? "";
            span.className = isFieldValid(name, validSet) ? BADGE_VALID_CLS : BADGE_INVALID_CLS;
        });
    }, [fieldNamesKey]);

    const handleInput = useCallback(() => {
        if (!divRef.current) return;
        const body = fromDiv(divRef.current);
        // In static-base mode the base lives outside the editable area, so prepend it —
        // but only when toHtml actually stripped it (baseStrippedRef). A value that
        // didn't start with the base stays whole in the body and must not gain a prefix.
        const newValue = baseStrippedRef.current && baseChip ? baseChip + body : body;
        lastInternalRef.current = newValue;
        onChange(newValue);
    }, [onChange, baseChip]);

    const insertBadge = useCallback(
        (name: string) => {
            if (!divRef.current) return;

            const validSet = new Set(fieldNames);
            const span = document.createElement("span");
            span.contentEditable = "false";
            span.setAttribute("data-field", name);
            span.className = validSet.has(name) ? BADGE_VALID_CLS : BADGE_INVALID_CLS;
            span.textContent = name;

            const zws = document.createTextNode("\u200B");

            const sel = window.getSelection();
            let range: Range;

            if (sel && sel.rangeCount > 0 && divRef.current.contains(sel.getRangeAt(0).commonAncestorContainer)) {
                range = sel.getRangeAt(0);
            } else {
                range = document.createRange();
                range.selectNodeContents(divRef.current);
                range.collapse(false);
            }

            range.deleteContents();
            range.insertNode(span);
            range.setStartAfter(span);
            range.collapse(true);
            range.insertNode(zws);
            range.setStartAfter(zws);
            range.collapse(true);

            if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
            }

            divRef.current.focus();
            handleInput();
        },
        [fieldNames, handleInput],
    );

    return (
        <TooltipProvider>
            <div className="space-y-1.5">
                <div className="flex items-end gap-1">
                    <div className="flex-1">
                        <div
                            className={cn(
                                "flex min-h-[3rem] w-full items-start gap-1.5 rounded-md border border-input bg-background px-2 py-1.5",
                                "focus-within:ring-1 focus-within:ring-ring",
                            )}
                        >
                            {staticBase && baseChip && baseActive && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className={cn(BADGE_BASE_CLS, "mt-px shrink-0 cursor-default")}>
                                            {baseLabel}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span className="font-mono whitespace-nowrap">{baseChip}</span>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            <div
                                ref={divRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={handleInput}
                                onFocus={onFocus}
                                onMouseOver={(e) => {
                                    const chip = (e.target as HTMLElement).closest?.(
                                        "[data-base]",
                                    ) as HTMLElement | null;
                                    setBaseAnchor(chip ? chip.getBoundingClientRect() : null);
                                }}
                                onMouseLeave={() => setBaseAnchor(null)}
                                data-placeholder={placeholder}
                                className={cn(
                                    "min-w-0 flex-1 self-stretch font-mono text-xs leading-relaxed",
                                    "focus:outline-none",
                                    "[&:empty]:before:pointer-events-none [&:empty]:before:text-muted-foreground [&:empty]:before:content-[attr(data-placeholder)]",
                                )}
                            />
                            {baseChip && baseAnchor && (
                                <Tooltip open>
                                    <TooltipTrigger asChild>
                                        <span
                                            aria-hidden
                                            className="pointer-events-none fixed"
                                            style={{
                                                left: baseAnchor.left,
                                                top: baseAnchor.top,
                                                width: baseAnchor.width,
                                                height: baseAnchor.height,
                                            }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span className="font-mono whitespace-nowrap">{baseChip}</span>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    {action}
                </div>
                {(fieldNames.length > 0 || fieldsAction || (!!baseChip && !staticBase) || !!extraControls) && (
                    <div className="flex flex-wrap items-center gap-1">
                        {fieldNames.length > 0 && tokensAs === "chips" && (
                            <>
                                <span className="text-xs text-muted-foreground">{l.clickTokenHint}</span>
                                {baseChip && !staticBase && (
                                    <Tooltip>
                                        {/* Trigger on a span, not the button: a disabled button swallows
                      pointer events, so the tooltip wouldn't show once the base is
                      already in the input (the badge's disabled state). */}
                                        <TooltipTrigger asChild>
                                            <span className="inline-flex">
                                                <button
                                                    type="button"
                                                    disabled={value.includes(baseChip)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => {
                                                        if (!value.includes(baseChip)) onChange(baseChip + value);
                                                    }}
                                                    className={cn(
                                                        "rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors",
                                                        value.includes(baseChip)
                                                            ? "cursor-not-allowed opacity-50"
                                                            : "cursor-pointer hover:bg-secondary/80",
                                                    )}
                                                >
                                                    {baseLabel}
                                                </button>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span className="font-mono whitespace-nowrap">{baseChip}</span>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                {fieldNames.map((name) => (
                                    <span
                                        key={name}
                                        className="inline-flex items-center overflow-hidden rounded bg-info/15 text-xs font-medium text-info"
                                    >
                                        <button
                                            type="button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => insertBadge(name)}
                                            title={l.insertTitle}
                                            className="cursor-pointer px-1.5 py-0.5 transition-colors hover:bg-info/25"
                                        >
                                            {name}
                                        </button>
                                        {onRemoveField && (
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => onRemoveField(name)}
                                                aria-label={l.removeTokenAriaLabel(name)}
                                                title={l.removeTokenTitle}
                                                className="cursor-pointer px-1 py-0.5 text-info/70 transition-colors hover:bg-info/25 hover:text-info"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </>
                        )}
                        {fieldNames.length > 0 && tokensAs === "combobox" && (
                            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 justify-between gap-1 text-xs"
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        <span className="text-muted-foreground">{l.insertComboboxPlaceholder}</span>
                                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="w-[min(20rem,calc(100vw-2rem))] p-0"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                >
                                    <Command>
                                        <CommandInput placeholder={l.searchPlaceholder} className="h-8 text-xs" />
                                        <CommandList>
                                            <CommandEmpty>{l.noMatches}</CommandEmpty>
                                            <CommandGroup>
                                                {fieldNames.map((name) => (
                                                    <CommandItem
                                                        key={name}
                                                        value={name}
                                                        onSelect={() => {
                                                            insertBadge(name);
                                                            setComboboxOpen(false);
                                                        }}
                                                        className="text-xs font-mono"
                                                    >
                                                        {name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                        {extraControls}
                        {fieldsAction && <div className="ml-auto">{fieldsAction}</div>}
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}
