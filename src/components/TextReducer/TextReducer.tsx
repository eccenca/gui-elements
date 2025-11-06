import React from "react";

import { reduceToText } from "../../common/utils/reduceToText";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { OverflowText, OverflowTextProps } from "./../Typography";

export interface TextReducerProps extends Pick<React.HTMLAttributes<HTMLElement>, "children"> {
    /**
     * Maximum number of nodes that are used from the HTML content.
     * An HTML element with multiple sub elements is count as only 1 node.
     */
    maxNodes?: number;
    /**
     * Set maximum string length of returned content.
     */
    maxLength?: number;
    /**
     * Wrap returned content automatically in a `OverflowText` component.
     * This way you always will get a element returned that displays only 1 single text line.
     */
    useOverflowTextWrapper?: boolean;
    /**
     * Specify more `OverflowText` properties used when `useOverflowTextWrapper` is set to `true`.
     */
    overflowTextProps?: Omit<OverflowTextProps, "passDown">;
}

/**
 * Component to reduce HTML markup content to simple text.
 * Display can be wrapped easily in `OverflowText`.
 */
export const TextReducer = ({
    children,
    maxNodes,
    maxLength,
    useOverflowTextWrapper,
    overflowTextProps,
}: TextReducerProps) => {
    if (typeof children === "undefined") {
        return <></>;
    }

    const shrinkedContent = reduceToText(children, { maxLength, maxNodes });

    return useOverflowTextWrapper ? (
        <OverflowText
            {...overflowTextProps}
            className={
                `${eccgui}-textreducer` +
                (overflowTextProps && overflowTextProps.className ? ` ${overflowTextProps.className}` : "")
            }
        >
            {shrinkedContent}
        </OverflowText>
    ) : (
        <>{shrinkedContent}</>
    );
};

export default TextReducer;
