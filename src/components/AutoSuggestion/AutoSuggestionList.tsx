import React from "react";
import computeScrollIntoView from "compute-scroll-into-view";
import {
    Menu,
    MenuItem,
    Highlighter,
    OverviewItem,
    OverviewItemDescription,
    OverviewItemLine,
    OverflowText,
    Spinner,
    Spacing,
    Tooltip,
} from "./../../";
import { ISuggestionWithReplacementInfo } from "./AutoSuggestion";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface AutoSuggestionListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    // The options of the drop down
    options: Array<ISuggestionWithReplacementInfo>;
    // Called when an item has been selected from the drop down
    onItemSelectionChange: (item: ISuggestionWithReplacementInfo) => any;
    // If the drop down is visible
    isOpen: boolean;
    // If the drop down should show a loading state
    loading?: boolean;
    // Register for changes in horizontal shift
    registerForHorizontalShift?: (callback: HorizontalShiftCallbackFunction) => any
    registerForVerticalShift?: (callback: HorizontalShiftCallbackFunction) => any
    // The item from the drop down that is active
    currentlyFocusedIndex: number;
    // Callback indicating what item should currently being highlighted, i.e. is either active or is hovered over
    itemToHighlight: (item: ISuggestionWithReplacementInfo | undefined) => any;
}

// @deprecated
export type IDropdownProps = AutoSuggestionListProps;

type HorizontalShiftCallbackFunction = (shift: number) => any

const ListItem = ({ item }: any, ref: any) => {
    const listItem = (
        <OverviewItem densityHigh={true}>
            <OverviewItemDescription>
                <OverviewItemLine>
                    <OverflowText ellipsis="reverse">
                        <Highlighter
                            label={item.value}
                            searchValue={item.query}
                        />
                    </OverflowText>
                </OverviewItemLine>
                {item.description ? (
                    <OverviewItemLine small={true}>
                        <OverflowText>
                            <Highlighter
                                label={item.description}
                                searchValue={item.query}
                            />
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
    registerForHorizontalShift,
    currentlyFocusedIndex,
    itemToHighlight,
    style,
    registerForVerticalShift,
    ...otherDivProps
}: AutoSuggestionListProps) => {
    const [hoveredItem, setHoveredItem] = React.useState<
        ISuggestionWithReplacementInfo | undefined
    >(undefined);
    const [left, setLeft] = React.useState(0)
    const [top, setTop] = React.useState(0)
    // Refs of list items
    const [refs] = React.useState<React.RefObject<Element>[]>([])
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const generateRef = (index: number) => {
        if (!refs[index]) {
            refs[index] = React.createRef();
        }
        return refs[index];
    };


    React.useEffect(() => {
        if(registerForVerticalShift) {
            const callback = (shift: number) => {
                console.log({shift})
                setTimeout(() => setTop(-shift), 1)
            }
            registerForVerticalShift(callback)
        }
    }, [registerForVerticalShift])

    React.useEffect(() => {
        if(registerForHorizontalShift) {
            const callback = (shift: number) => {
                setTimeout(() => setLeft(shift), 1)
            }
            registerForHorizontalShift(callback)
        }
    }, [registerForHorizontalShift])

    React.useEffect(() => {
        const listIndexNode = refs[currentlyFocusedIndex];
        if (dropdownRef?.current && listIndexNode?.current) {
            const actions = computeScrollIntoView(listIndexNode.current, {
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

    const focusedItem = options[currentlyFocusedIndex]

    // Decide which item to highlight
    React.useEffect(() => {
        itemToHighlight(!isOpen ? undefined : hoveredItem || focusedItem);
    }, [
        currentlyFocusedIndex,
        itemToHighlight,
        focusedItem,
        isOpen,
        hoveredItem,
    ]);

    const Loader = (
        <OverviewItem hasSpacing>
            <OverviewItemLine>Fetching suggestions</OverviewItemLine>
            <Spacing size="tiny" vertical={true} />
            <Spinner position="inline" description="" />
        </OverviewItem>
    );

    const loadingOrHasSuggestions = loading || options.length;
    if (!loadingOrHasSuggestions || !isOpen) return null;
    return (
        <div
            {...otherDivProps}
            className={`${eccgui}-autosuggestion__dropdown`}
            style={{ ...style, left , top}}
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
                            text={(
                                <Item
                                    ref={generateRef(index)}
                                    item={item}
                                />
                            )}
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
