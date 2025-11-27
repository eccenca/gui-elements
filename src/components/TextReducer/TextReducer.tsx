import React from "react";

import { DecodeHtmlEntitiesOptions, utils } from "../../common";
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
    /**
     * If you transform HTML markup to text then the result could contain HTML entity encoded strings.
     * By enabling this option they are decoded back to it's original char.
     */
    decodeHtmlEntities?: boolean;
    /**
     * Set the options used to decode the HTML entities, if `decodeHtmlEntities` is enabled.
     * Internally we use `he` library, see their [documentation on decode options](https://www.npmjs.com/package/he#hedecodehtml-options).
     * If not set we use `{ isAttributeValue: true, strict: true }` as default value.
     */
    decodeHtmlEntitiesOptions?: DecodeHtmlEntitiesOptions;
}

/**
 * Component to reduce HTML markup content to simple text.
 * Display can be wrapped easily in `OverflowText`.
 */
export const TextReducer = ({
    children,
    useOverflowTextWrapper,
    overflowTextProps,
    ...reduceToTextOptions
}: TextReducerProps) => {
    if (typeof children === "undefined") {
        return <></>;
    }

    const shrinkedContent = utils.reduceToText(children, reduceToTextOptions);

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
