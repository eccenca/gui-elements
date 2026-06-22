import React from "react";

import { MarkdownProps } from "../../cmem/markdown/Markdown";

import { reduceToText, ReduceToTextFuncType } from "./reduceToText";

interface MarkdownWithCutOffProps extends Omit<MarkdownProps, "cutOff"> {
    cutOff: NonNullable<MarkdownProps["cutOff"]>;
}

interface TruncateMarkdownDisplayType {
    (
        /**
         *  Markdown element with mandatory `cutOff` property.
         */
        input: React.ReactElement<MarkdownWithCutOffProps>,
        /**
         * Options given to the internal used `reduceToText` function.
         */
        reduceToTextOptions?: Pick<
            NonNullable<Parameters<ReduceToTextFuncType>[1]>,
            "decodeHtmlEntities" | "decodeHtmlEntitiesOptions"
        >,
        /**
         * Maximum number of rounds to iterate over text length of the rendered Markdown display.
         */
        maxRounds?: number,
    ): React.ReactElement;
}

/**
 * The internal `truncateMarkdown` function cuts off the raw Markdown content.
 * Because of the Markdown syntax, the rendered Markdown content can be much shorter (e.g., Markdown link syntax is
 * longer than the rendered link text).
 *
 * This method iterates over a series of Markdown displays, updating the internally used `cutOff` value to create a
 * Markdown result whose text length is closer to the initial `cutOff` value.
 *
 * As a fast path, if the Markdown rendered without any `cutOff` is already shorter than or equal to the initial
 * `cutOff`, the untruncated element is returned without iteration.
 *
 * Otherwise, the algorithm:
 *
 * * calculates a factor from the given `cutOff` and the text length of the returned Markdown element
 * * uses this factor to adjust the `cutOff` value applied in the next iteration
 * * loops over the iterations and tracks the result whose rendered text length is closest to the initial `cutOff`
 *
 * The loop will stop when:
 *
 * * the text length of the Markdown result does not change over one iteration step
 * * the adjusted `cutOff` value does not change over one iteration step (no further progress possible)
 * * the text length of the Markdown result is exactly the given initial `cutOff`
 * * the maximum number of iteration rounds is reached (defaults to `5`)
 *
 * The returned element is the iteration whose rendered text length is closest in absolute distance to the initial
 * `cutOff`. This may be slightly over or under the initial `cutOff` value.
 */
export const truncateMarkdownDisplay: TruncateMarkdownDisplayType = (input, reduceToTextOptions, maxRounds = 5) => {
    const initialCutOff = input.props.cutOff;

    const untruncated = React.cloneElement(input, { cutOff: undefined });
    const untruncatedLength = reduceToText(untruncated, reduceToTextOptions).length;
    if (untruncatedLength <= initialCutOff) {
        return untruncated;
    }

    let currentCutOff = initialCutOff;
    let currentLength = reduceToText(input, reduceToTextOptions).length;

    let bestElement: React.ReactElement = input;
    let bestDistance = Math.abs(currentLength - initialCutOff);

    for (let round = 0; round < maxRounds; round++) {
        if (currentLength === initialCutOff || currentLength === 0) break;

        const nextCutOff = Math.max(1, Math.round(currentCutOff * (initialCutOff / currentLength)));
        if (nextCutOff === currentCutOff) break;

        const nextElement = React.cloneElement(input, { cutOff: nextCutOff });
        const nextLength = reduceToText(nextElement, reduceToTextOptions).length;

        const nextDistance = Math.abs(nextLength - initialCutOff);
        if (nextDistance < bestDistance) {
            bestDistance = nextDistance;
            bestElement = nextElement;
        }

        if (nextLength === currentLength) break;

        currentCutOff = nextCutOff;
        currentLength = nextLength;
    }

    return bestElement;
};
