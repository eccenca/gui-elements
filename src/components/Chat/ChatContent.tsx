import React from "react";

import { TestableComponent } from "../../components/interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Markdown, MarkdownProps } from "./../../cmem/markdown/Markdown";
import { DepictionProps } from "./../Depiction/Depiction";
import { FlexibleLayoutContainer, FlexibleLayoutItem } from "./../FlexibleLayout";
import { Spacing } from "./../Separation/Spacing";
import { HtmlContentBlock, OverflowTextProps, WhiteSpaceContainer } from "./../Typography";

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
     * If indented then the content box has some white space on one side.
     */
    indentation?: boolean;
    /**
     * How the content box and avatar is aligned.
     * If `left` is set then the avatar is on the left side, and the indentation on the right side.
     */
    alignment?: "left" | "right" | "block";
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
    indentation = true,
    alignment = "left",
    markdownProps,
    ...otherDivProps
}: ChatContentProps) => {
    const content = (
        <div
            className={
                `${eccgui}-chat__content` +
                ` ${eccgui}-chat__content--display-${displayType}` +
                ` ${eccgui}-chat__content--align-${alignment}` +
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

    return (
        <WhiteSpaceContainer
            marginLeft={alignment === "right" && indentation ? "xlarge" : undefined}
            marginRight={alignment === "left" && indentation ? "xlarge" : undefined}
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
                    <FlexibleLayoutItem>{content}</FlexibleLayoutItem>
                </FlexibleLayoutContainer>
            ) : (
                content
            )}
        </WhiteSpaceContainer>
    );
};

export default ChatContent;
