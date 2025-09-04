import React from "react";
import { renderToString } from "react-dom/server";
import * as ReactIs from "react-is";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Markdown } from "./../../cmem/markdown/Markdown";
import { OverflowText, OverflowTextProps } from "./../Typography";

export interface ContentShrinkerProps extends Pick<React.HTMLAttributes<HTMLElement>, "children"> {
    /**
     * Wrap returned content automatically in a `OverflowText` component.
     * This way you always will get a element returned that displays only 1 single text line.
     */
    useOverflowTextWrapper?: boolean;
    /**
     * Specify more `OverflowText` properties that were used when `useOverflowTextWrapper` is set to `true`.
     */
    overflowTextProps?: Omit<OverflowTextProps, "passDown">;
}

/**
 * Component to reduce HTML markup content to simple text.
 * Display can be wrapped easily in `OverflowText`.
 */
export const ContentShrinker = ({ children, useOverflowTextWrapper, overflowTextProps }: ContentShrinkerProps) => {
    const onlyText = (children: React.ReactNode | React.ReactNode[]): string => {
        if (children instanceof Array) {
            return children
                .map((child: React.ReactNode) => {
                    return onlyText(child);
                })
                .join(" ");
        }

        return React.Children.toArray(children)
            .map((child) => {
                if (ReactIs.isFragment(child)) {
                    return onlyText(child.props?.children);
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

    const shrinkedContent = (
        <Markdown removeMarkup inheritBlock allowedElements={[]}>
            {onlyText(children)}
        </Markdown>
    );

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
        shrinkedContent
    );
};

export default ContentShrinker;
