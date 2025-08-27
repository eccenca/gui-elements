import React from "react";

import { TestableComponent } from "../../components/interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Markdown, MarkdownProps } from "./../../cmem/markdown/Markdown";
import { DepictionProps } from "./../Depiction/Depiction";
import { FlexibleLayoutContainer, FlexibleLayoutItem } from "./../FlexibleLayout";
import { Spacing } from "./../Separation/Spacing";
import { HtmlContentBlock, OverflowTextProps } from "./../Typography";

export interface ChatContentProps extends React.HTMLAttributes<HTMLDivElement>, TestableComponent {
    /**
     * Should be a line of text, e.g. username, timestamp, ...
     */
    statusLine?: React.ReactElement<OverflowTextProps>;
    /**
     * How the chat content box is displayed.
     */
    displayType?: "free" | "simple" | "bubble";
    /**
     * A depiction used as avatar next to the content box.
     */
    avatar?: React.ReactElement<DepictionProps>;
    /**
     * If indented then the content box has some white space on the opposite side to the alignment
     */
    indentationSize?: "small" | "medium" | "large";
    /**
     * How the content box and avatar is aligned.
     * If `left` is set then the avatar is on the left side, and the indentation on the right side.
     */
    alignment?: "left" | "right";
    /**
     * If set then the chat bubble only grows to a height of 50% of the viewport.
     * In case you need to set other maximum heights then use the `style` property directly.
     */
    limitHeight?: boolean;
    /**
     * If given then the content is automatically parsed and displayed by our `<Markdown />` component.
     * `children` need to a `string` then, otherwise it cannot be parsed.
     */
    markdownProps?: Omit<MarkdownProps, "children">;
}

/**
 * Component to display singe chat contents, including avatar and status line.
 */
export const ChatContent = ({
    className,
    children,
    statusLine,
    avatar,
    displayType = "bubble",
    indentationSize,
    alignment = "left",
    limitHeight,
    markdownProps,
    ...otherDivProps
}: ChatContentProps) => {
    const content = (
        <div
            className={
                `${eccgui}-chat__content` +
                ` ${eccgui}-chat__content--display-${displayType}` +
                ` ${eccgui}-chat__content--align-${alignment}` +
                (limitHeight ? ` ${eccgui}-chat__content--limitheight` : "") +
                (className ? ` ${className}` : "")
            }
            {...otherDivProps}
        >
            {statusLine && (
                <HtmlContentBlock small>
                    {statusLine}
                    <Spacing size="tiny" />
                </HtmlContentBlock>
            )}
            {markdownProps && typeof children === "string" ? (
                <Markdown {...markdownProps}>{children}</Markdown>
            ) : (
                children
            )}
        </div>
    );

    const indentationSizes = {
        small: "8%",
        medium: "21%",
        large: "34%",
    };

    return (
        <div
            style={{
                marginLeft: alignment === "right" && indentationSize ? indentationSizes[indentationSize] : undefined,
                marginRight: alignment === "left" && indentationSize ? indentationSizes[indentationSize] : undefined,
            }}
        >
            {avatar ? (
                <FlexibleLayoutContainer noEqualItemSpace gapSize="tiny">
                    <FlexibleLayoutItem
                        growFactor={0}
                        shrinkFactor={0}
                        style={alignment === "right" ? { order: 1 } : undefined}
                    >
                        {React.cloneElement(avatar, { size: "small", ratio: "1:1", rounded: true, resizing: "cover" })}
                    </FlexibleLayoutItem>
                    <FlexibleLayoutItem className={`${eccgui}-chat__content-wrapper`}>{content}</FlexibleLayoutItem>
                </FlexibleLayoutContainer>
            ) : (
                content
            )}
        </div>
    );
};

export default ChatContent;
