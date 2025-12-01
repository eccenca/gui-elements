import React from "react";
import { compute } from "compute-scroll-into-view";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import {
    Highlighter,
    Menu,
    MenuItem,
    OverflowText,
    OverviewItem,
    OverviewItemDescription,
    OverviewItemLine,
    Spacing,
    Spinner,
    Tooltip,
} from "./../../";
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
                    <OverviewItemLine small={true} >
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
    const [hoveredItem, setHoveredItem] = React.useState<CodeAutocompleteFieldSuggestionWithReplacementInfo | undefined>(undefined);
    // Refs of list items
    const [refs] = React.useState<React.RefObject<Element>[]>([]);
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

    // Decide which item to highlight
    React.useEffect(() => {
        itemToHighlight(!isOpen ? undefined : hoveredItem || focusedItem);
    }, [currentlyFocusedIndex, itemToHighlight, focusedItem, isOpen, hoveredItem]);

    const Loader = (
        <OverviewItem hasSpacing>
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
            className={`${eccgui}-autosuggestion__dropdown`}
            style={{ ...style, left: offsetValues?.x ?? 0, top: offsetValues?.y ?? 0 }}
            ref={dropdownRef}
        >
            {loading ? (
                Loader
            ) : (
                <Menu>
                    {options.map((item, index) => (
                        <MenuItem
                            key={index}
                            active={currentlyFocusedIndex === index}
                            onMouseDown={(e: any) => e.preventDefault()}
                            onClick={() => onItemSelectionChange(item)}
                            text={<Item ref={generateRef(index)} item={item} />}
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(undefined)}
                            onMouseOver={() => {
                                if (item.value !== hoveredItem?.value) {
                                    setHoveredItem(item);
                                }
                            }}
                        />
                    ))}
                </Menu>
            )}
        </div>
    );
};
