import React from "react";
import { renderToString } from "react-dom/server";
import * as ReactIs from "react-is";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Markdown } from "./../../cmem/markdown/Markdown";
import { OverflowText, OverflowTextProps } from "./../Typography";

export type ContentShrinkerProps = Omit<OverflowTextProps, "passDown" | "useHtmlElement">;

/**
 * Component to shrink HTML markup content to 1 single text line.
 * Display is based on `OverflowText`.
 */
export const ContentShrinker = ({ className, children, ...otherOverflowProps }: ContentShrinkerProps) => {
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
            .join(" ");
    };

    return (
        <OverflowText
            className={`${eccgui}-contentshrinker` + (className ? ` ${className}` : "")}
            passDown
            {...otherOverflowProps}
        >
            <Markdown removeMarkup inheritBlock>
                {onlyText(children)}
            </Markdown>
        </OverflowText>
    );
};

export default ContentShrinker;
