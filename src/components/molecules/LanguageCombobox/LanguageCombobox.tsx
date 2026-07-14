import { useMemo, useState } from "react";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/_shadcn/ui/combobox";

import { type LanguageTag, languageTags } from "./languageTags";

export interface LanguageComboboxProps {
    /** Currently selected language tag (empty string for none). */
    value: string;
    /** Called with the picked code, or the free-typed custom tag on Enter. */
    onSelect: (tag: string) => void;
    onFocus?: () => void;
    invalid?: boolean;
    /** Option list; defaults to the full ISO 639-1 set. */
    tags?: LanguageTag[];
    /** Placeholder of the search input. English default; pass a translation to localize. */
    searchPlaceholder?: string;
    /** Empty state when nothing matches. English default; pass a translation to localize. */
    noResultsLabel?: string;
    /** Secondary label of the free-typed custom entry. English default; pass a translation to localize. */
    customTagLabel?: string;
}

/**
 * Searchable picker over a language-tag list (default: full ISO 639-1 set).
 * Filters by code or language name; a free-typed tag that isn't an exact code
 * match (e.g. a region subtag like `en-GB`) is offered as a custom entry so
 * arbitrary BCP 47 tags still commit. Selection (or Enter on the custom
 * entry) calls `onSelect`.
 */
export function LanguageCombobox({
    value,
    onSelect,
    onFocus,
    invalid,
    tags = languageTags,
    searchPlaceholder = "Search language… e.g. en or en-GB",
    noResultsLabel = "No languages found.",
    customTagLabel = "Use custom tag",
}: LanguageComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const labelByCode = useMemo(() => new Map(tags.map((tag) => [tag.code, tag.label])), [tags]);

    const trimmed = search.trim();
    const q = trimmed.toLowerCase();
    const matches = q
        ? tags.filter((tag) => tag.code.toLowerCase().startsWith(q) || tag.label.toLowerCase().includes(q))
        : tags;
    const exact = tags.some((tag) => tag.code.toLowerCase() === q);
    const codes = matches.map((tag) => tag.code);
    const items = trimmed && !exact ? [...codes, trimmed] : codes;

    return (
        <Combobox
            value={value || null}
            onValueChange={(code) => {
                if (code) onSelect(code);
            }}
            open={open}
            onOpenChange={setOpen}
            onInputValueChange={setSearch}
            items={items}
            filter={null}
        >
            <ComboboxInput
                placeholder={searchPlaceholder}
                onFocus={onFocus}
                aria-invalid={invalid || undefined}
                className="h-8 text-sm"
            />
            <ComboboxContent>
                <ComboboxEmpty>{noResultsLabel}</ComboboxEmpty>
                <ComboboxList>
                    {(code: string) => {
                        const label = labelByCode.get(code);
                        return (
                            <ComboboxItem key={code} value={code}>
                                <span className="font-mono text-xs uppercase">{code}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {label ?? customTagLabel}
                                </span>
                            </ComboboxItem>
                        );
                    }}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
