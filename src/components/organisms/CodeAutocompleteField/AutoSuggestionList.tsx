import React from "react";
import { compute } from "compute-scroll-into-view";

import { cn } from "@/common/utils/cn";
import { Spacing } from "@/components/atoms/Separation/Spacing";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { Tooltip } from "@/components/atoms/Tooltip/Tooltip";
import { Highlighter, OverflowText } from "@/components/atoms/Typography";
import { Menu, MenuItem } from "@/components/molecules/Menu";
import { OverviewItem, OverviewItemDescription, OverviewItemLine } from "@/components/molecules/OverviewItem";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import { CodeAutocompleteFieldSuggestionWithReplacementInfo } from "./AutoSuggestion";

export interface AutoSuggestionListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    // The options of the drop down
    options: Array<CodeAutocompleteFieldSuggestionWithReplacementInfo>;
    // Called when an item has been selected from the drop down
    onItemSelectionChange: (item: CodeAutocompleteFieldSuggestionWithReplacementInfo) => any;
    // If the drop down is visible
    isOpen: boolean;
    // If the drop down should show a loading state
    loading?: boolean;
    // The item from the drop down that is active
    currentlyFocusedIndex: number;
    // Callback indicating what item should currently being highlighted, i.e. is either active or is hovered over
    itemToHighlight: (item: CodeAutocompleteFieldSuggestionWithReplacementInfo | undefined) => any;
    /** horizontal and vertical offset values in relation to the cursor */
    offsetValues?: { x: number; y: number };
}

const ListItem = ({ item }: any, ref: any) => {
    const listItem = (
        <OverviewItem densityHigh={true}>
            <OverviewItemDescription>
                <OverviewItemLine>
                    <OverflowText ellipsis="reverse">
                        <Highlighter label={item.value} searchValue={item.query} />
                    </OverflowText>
                </OverviewItemLine>
                {item.label ? (
                    <OverviewItemLine small={true}>
                        <OverflowText>
                            <Highlighter label={item.label} searchValue={item.query} />
                        </OverflowText>
                    </OverviewItemLine>
                ) : null}
                {item.description ? (
                    <OverviewItemLine small={true}>
                        <OverflowText>
                            <Highlighter label={item.description} searchValue={item.query} />
                        </OverflowText>
                    </OverviewItemLine>
                ) : null}
            </OverviewItemDescription>
        </OverviewItem>
    );

    return (
        <div ref={ref}>
            {!!item.description && item.description.length > 50 ? (
                <Tooltip content={item.description}>{listItem}</Tooltip>
            ) : (
                <>{listItem}</>
            )}
        </div>
    );
};

const Item = React.forwardRef(ListItem);

/** A drop-down-like list that can be used in combination with other components to show and select items. */
export const AutoSuggestionList = ({
    isOpen,
    options,
    loading,
    onItemSelectionChange,
    currentlyFocusedIndex,
    itemToHighlight,
    style,
    offsetValues,
    ...otherDivProps
}: AutoSuggestionListProps) => {
    const [hoveredItem, setHoveredItem] = React.useState<
        CodeAutocompleteFieldSuggestionWithReplacementInfo | undefined
    >(undefined);
    // Refs of list items
    const [refs] = React.useState<React.RefObject<Element | null>[]>([]);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const generateRef = (index: number) => {
        if (!refs[index]) {
            refs[index] = React.createRef();
        }
        return refs[index];
    };

    React.useEffect(() => {
        const listIndexNode = refs[currentlyFocusedIndex];
        if (dropdownRef?.current && listIndexNode?.current) {
            const actions = compute(listIndexNode.current, {
                boundary: dropdownRef.current,
                block: "nearest",
                scrollMode: "if-needed",
            });
            actions.forEach(({ el, top, left }) => {
                el.scrollTop = top;
                el.scrollLeft = left;
            });
        }
    }, [currentlyFocusedIndex, refs]);

    const focusedItem = options[currentlyFocusedIndex];

    // Decide which item to highlight. `hoveredItem` toggles on every mouse enter/leave, but only
    // notify the parent when the *resolved* highlight target actually changes (e.g. hovering the
    // already-focused entry resolves to the same item) so we don't emit redundant, same-argument
    // callbacks.
    const lastHighlightedRef = React.useRef<{
        item: CodeAutocompleteFieldSuggestionWithReplacementInfo | undefined;
    } | null>(null);
    React.useEffect(() => {
        const nextItem = !isOpen ? undefined : hoveredItem || focusedItem;
        if (lastHighlightedRef.current && lastHighlightedRef.current.item === nextItem) {
            return;
        }
        lastHighlightedRef.current = { item: nextItem };
        itemToHighlight(nextItem);
    }, [currentlyFocusedIndex, itemToHighlight, focusedItem, isOpen, hoveredItem]);

    const Loader = (
        // `box-border max-w-[336px]` ported from AutoSuggestion.scss `.eccgui-overviewitem__item` cap.
        <OverviewItem hasSpacing className="box-border max-w-[336px]">
            <OverviewItemLine>Fetching suggestions</OverviewItemLine>
            <Spacing size="tiny" vertical={true} />
            <Spinner position="inline" />
        </OverviewItem>
    );

    const loadingOrHasSuggestions = loading || options.length;
    if (!loadingOrHasSuggestions || !isOpen) return null;
    return (
        <div
            {...otherDivProps}
            className={cn(
                `${eccgui}-autosuggestion__dropdown`,
                // ported from AutoSuggestion.scss `.eccgui-autosuggestion__dropdown` (SCSS sunset);
                // `left`/`top` stay inline (set from the cursor offset). `flex-flow: column wrap` and
                // `overflow: hidden auto` are split into their longhand utilities. The inner
                // `.eccgui-menu__list` / `.eccgui-overviewitem__item` `max-width: 336px` caps are applied
                // on the `Menu` / Loader `OverviewItem` below (BEM `__` classes can't be targeted by a
                // Tailwind arbitrary variant — underscores become spaces).
                "absolute z-[2] flex flex-col flex-wrap max-w-[350px] max-h-[420px] overflow-x-hidden overflow-y-auto",
                "rounded-md border border-border bg-popover transition-all duration-300",
            )}
            style={{ ...style, left: offsetValues?.x ?? 0, top: offsetValues?.y ?? 0 }}
            ref={dropdownRef}
        >
            {loading ? (
                Loader
            ) : (
                // `box-border max-w-[336px]` ported from AutoSuggestion.scss `.eccgui-menu__list` cap
                // (the `Menu` component forwards className to the `.eccgui-menu__list` element).
                <Menu className="box-border max-w-[336px]">
                    {options.map((item, index) => (
                        <MenuItem
                            key={index}
                            active={currentlyFocusedIndex === index}
                            onMouseDown={(e: any) => e.preventDefault()}
                            onClick={() => onItemSelectionChange(item)}
                            text={<Item ref={generateRef(index)} item={item} />}
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(undefined)}
                        />
                    ))}
                </Menu>
            )}
        </div>
    );
};
