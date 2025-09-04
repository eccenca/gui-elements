import React from "react";
import { renderToString } from "react-dom/server";
import * as ReactIs from "react-is";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { OverflowText, OverflowTextProps } from "./../Typography";

export interface ContentShrinkerProps extends Pick<React.HTMLAttributes<HTMLElement>, "children"> {
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
export const ContentShrinker = ({
    children,
    maxNodes,
    maxLength,
    useOverflowTextWrapper,
    overflowTextProps,
}: ContentShrinkerProps) => {
    const nodesCount = 0;

    const onlyText = (children: React.ReactNode | React.ReactNode[], maxNodes?: number): string => {
        if (typeof maxNodes !== "undefined" && nodesCount >= maxNodes) {
            return "";
        }

        if (children instanceof Array) {
            return children
                .slice(0, maxNodes)
                .map((child: React.ReactNode) => {
                    return onlyText(child, maxNodes);
                })
                .join(" ");
        }

        return React.Children.toArray(children)
            .slice(0, maxNodes)
            .map((child) => {
                if (ReactIs.isFragment(child)) {
                    return onlyText(child.props?.children, maxNodes);
                }
                if (typeof child === "string") {
                    return child;
                }
                if (typeof child === "number") {
                    return child.toString();
                }
                if (ReactIs.isElement(child)) {
                    // for some reasons `renderToString` returns empty string if not wrappe in a `span`
                    return renderToString(<span>{child}</span>);
                }
                return "";
            })
            .join(" ")
            .replaceAll("\n", " ");
    };

    const shrinkedContent = onlyText(children, maxNodes)
        .replaceAll(/<[^\s][^>]*>/g, "")
        .slice(0, maxLength);

    return useOverflowTextWrapper ? (
        <OverflowText
            {...overflowTextProps}
            className={
                `${eccgui}-contentshrinker` +
                (overflowTextProps && overflowTextProps.className ? ` ${overflowTextProps.className}` : "")
            }
        >
            {shrinkedContent}
        </OverflowText>
    ) : (
        <>{shrinkedContent}</>
    );
};

export default ContentShrinker;
