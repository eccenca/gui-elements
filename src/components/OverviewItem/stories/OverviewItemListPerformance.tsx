import React from "react";
import { loremIpsum } from "react-lorem-ipsum";

import {
    ApplicationContainer,
    Button,
    ContextMenu,
    Depiction,
    Icon,
    IconButton,
    OverflowText,
    OverviewItem,
    OverviewItemActions,
    OverviewItemDescription,
    OverviewItemLine,
    OverviewItemList,
    Spinner,
    Tooltip,
} from "./../../../../index";
import { Default as ContextMenuExample } from "./../../ContextOverlay/ContextMenu.stories";
import canonicalIcons, { ValidIconName } from "./../../Icon/canonicalIconNames";

interface OverviewItemListPerformanceProps {
    /** list length */
    length: number;
    /** include `OverviewItem` elements in list */
    useOverviewitem: boolean;
    /** include depiction */
    withDepiction: boolean;
    /** include description */
    withDescription: boolean;
    /** include icon button in hidden actions */
    withIconButtonInHiddenActions: boolean;
    /** include button in actions */
    withButtonInActions: boolean;
    /** inlcude context menu in actions */
    withContextMenuInActions: boolean;
    /** include tooltips on all elments that can have one */
    withTooltips: boolean;
    /** delay rendering of action items */
    delayActions: number;
}

const createTextArray = (items: number, length: number) => {
    return loremIpsum({
        p: 1,
        avgWordsPerSentence: length,
        avgSentencesPerParagraph: items,
        startWithLoremIpsum: false,
        random: false,
    })[0].split(". ");
};

const textShort = createTextArray(100, 3);
const textLong = createTextArray(100, 25);

export const OverviewItemListPerformance = ({
    length = 1000,
    useOverviewitem = false,
    withDepiction = false,
    withDescription = true,
    withButtonInActions = false,
    withIconButtonInHiddenActions = false,
    withTooltips = false,
    withContextMenuInActions = false,
    delayActions = 1,
}: OverviewItemListPerformanceProps) => {
    const renderStart = new Date();
    const containerRef = React.useRef(null);

    const iconNames = Object.keys(canonicalIcons);

    const ItemWrapper = useOverviewitem ? OverviewItem : "div";
    const ItemDescription = useOverviewitem ? OverviewItemDescription : "div";
    const ItemLine = useOverviewitem ? OverviewItemLine : "div";
    const ItemActions = useOverviewitem ? OverviewItemActions : "span";

    const actionsProps = useOverviewitem
        ? { delayDisplayChildren: delayActions, delaySkeleton: <Spinner position="inline" size="tiny" /> }
        : {};
    const hiddenActionsProps = useOverviewitem ? { ...actionsProps, hiddenInteractions: true } : {};

    React.useEffect(() => {
        const renderEnd = new Date();
        // eslint-disable-next-line no-console
        console.log(
            "OverviewItemListPerformance Rendering time (s)",
            (renderEnd.getTime() - renderStart.getTime()) / 1000
        );
    });

    return (
        <div ref={containerRef}>
            <ApplicationContainer>
                <OverviewItemList hasDivider hasSpacing columns={useOverviewitem ? 2 : 1}>
                    {Array(length)
                        .fill("x")
                        .map((_, id) => {
                            return (
                                <ItemWrapper key={id}>
                                    {withDepiction && (
                                        <Depiction
                                            size="small"
                                            image={<Icon name={iconNames[id % iconNames.length] as ValidIconName} />}
                                            caption={withTooltips ? textShort[(id + 10) % textShort.length] : undefined}
                                            captionPosition={withTooltips ? "tooltip" : "none"}
                                        />
                                    )}
                                    {withDescription && (
                                        <ItemDescription>
                                            <ItemLine large={useOverviewitem ? true : undefined}>
                                                {textShort[id % textShort.length]}
                                            </ItemLine>
                                            <ItemLine small={useOverviewitem ? true : undefined}>
                                                {withTooltips ? (
                                                    <Tooltip content={textLong[id % textLong.length]}>
                                                        <OverflowText>{textLong[id % textLong.length]}</OverflowText>
                                                    </Tooltip>
                                                ) : (
                                                    <OverflowText>{textLong[id % textLong.length]}</OverflowText>
                                                )}
                                            </ItemLine>
                                        </ItemDescription>
                                    )}
                                    {withIconButtonInHiddenActions && (
                                        <ItemActions {...hiddenActionsProps}>
                                            <IconButton
                                                name={iconNames[(id + 23) % iconNames.length] as ValidIconName}
                                                text={textShort[(id + 27) % textShort.length]}
                                                tooltipAsTitle={!withTooltips}
                                            />
                                        </ItemActions>
                                    )}
                                    {(withButtonInActions || withContextMenuInActions) && (
                                        <ItemActions {...actionsProps}>
                                            {withButtonInActions && (
                                                <Button onClick={() => alert("Button clicked")}>
                                                    {textShort[(id + 77) % textShort.length]}
                                                </Button>
                                            )}
                                            {withContextMenuInActions && (
                                                <ContextMenu
                                                    {...ContextMenuExample.args}
                                                    tooltipAsTitle={!withTooltips}
                                                />
                                            )}
                                        </ItemActions>
                                    )}
                                </ItemWrapper>
                            );
                        })}
                </OverviewItemList>
            </ApplicationContainer>
        </div>
    );
};
