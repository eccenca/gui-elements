import React from "react";
import { loremIpsum } from "react-lorem-ipsum";

import {
    ApplicationContainer,
    Button,
    Depiction,
    Icon,
    IconButton,
    OverflowText,
    OverviewItem,
    OverviewItemActions,
    OverviewItemDescription,
    OverviewItemLine,
    OverviewItemList,
    Tooltip,
} from "./../../../../index";
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
    /** include hidden actions */
    withHiddenActions: boolean;
    /** include actions */
    withActions: boolean;
    /** inlcude tooltips */
    withTooltips: boolean;
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
    withActions = false,
    withHiddenActions = false,
    withTooltips = false,
}: OverviewItemListPerformanceProps) => {
    const iconNames = Object.keys(canonicalIcons);

    const ItemWrapper = useOverviewitem ? OverviewItem : "div";
    const ItemDescription = useOverviewitem ? OverviewItemDescription : "div";
    const ItemLine = useOverviewitem ? OverviewItemLine : "div";
    const ItemActions = useOverviewitem ? OverviewItemActions : "span";

    return (
        <ApplicationContainer>
            <OverviewItemList hasDivider hasSpacing columns={2}>
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
                                        captionPosition="tooltip"
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
                                {withHiddenActions && (
                                    <ItemActions hiddenInteractions={useOverviewitem ? true : undefined}>
                                        <IconButton
                                            name={iconNames[(id + 23) % iconNames.length] as ValidIconName}
                                            text={textShort[(id + 27) % textShort.length]}
                                            tooltipAsTitle={!withTooltips}
                                        />
                                        <IconButton
                                            name={iconNames[(id + 35) % iconNames.length] as ValidIconName}
                                            text={textShort[(id + 39) % textShort.length]}
                                            tooltipAsTitle={!withTooltips}
                                        />
                                    </ItemActions>
                                )}
                                {withActions && (
                                    <ItemActions>
                                        <IconButton
                                            name={iconNames[(id + 43) % iconNames.length] as ValidIconName}
                                            text={textShort[(id + 47) % textShort.length]}
                                            tooltipAsTitle={!withTooltips}
                                        />
                                        <IconButton
                                            name={iconNames[(id + 65) % iconNames.length] as ValidIconName}
                                            text={textShort[(id + 69) % textShort.length]}
                                            tooltipAsTitle={!withTooltips}
                                        />
                                        <Button>{textShort[(id + 77) % textShort.length]}</Button>
                                    </ItemActions>
                                )}
                            </ItemWrapper>
                        );
                    })}
            </OverviewItemList>
        </ApplicationContainer>
    );
};
