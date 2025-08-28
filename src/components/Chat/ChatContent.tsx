import React from "react";
import { renderToString } from "react-dom/server";
import * as ReactIs from "react-is";

import { TestableComponent } from "../../components/interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Markdown, MarkdownProps } from "./../../cmem/markdown/Markdown";
import { DepictionProps } from "./../Depiction/Depiction";
import { FlexibleLayoutContainer, FlexibleLayoutItem } from "./../FlexibleLayout";
import { IconButton } from "./../Icon/IconButton";
import { Spacing } from "./../Separation/Spacing";
import { HtmlContentBlock, OverflowText, OverflowTextProps } from "./../Typography";

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
    limitHeight?: React.ReactChild;
    /**
     * If given then the content is automatically parsed and displayed by our `<Markdown />` component.
     * `children` need to a `string` then, otherwise it cannot be parsed.
     */
    markdownProps?: Omit<MarkdownProps, "children">;
    /**
     * Callback handler if content should be expanded.
     * Button to shrink/expand is displayed, depending on `shrinked` value.
     * If this handler is given then the component never will change the `shrinked` state automatically.
     */
    onToggleSize?: () => void;
    /**
     * Content should dislayed shrinked.
     * Button to expand content is displayed.
     * Component can reduce content automatically to one line if `autoShrink` is set to `true`.
     * If `onToggleSize` handler is not given then `autoShrink=true` is inferred and size toggling is automatically provided.
     */
    shrinked?: boolean;
    /**
     * Children elements are automatically shrinked to one line.
     * If `shrinked` are not given then `shrinked=true` is infered.
     */
    autoShrink?: boolean;
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
    shrinked,
    autoShrink,
    onToggleSize,
    ...otherDivProps
}: ChatContentProps) => {
    const [displayShrinked, setDispayShrinked] = React.useState<boolean>(
        shrinked === true || (autoShrink === true && typeof shrinked === "undefined")
    );

    const toggleSize = () => {
        if (onToggleSize) {
            onToggleSize();
        } else {
            setDispayShrinked(!displayShrinked);
        }
    };

    const content =
        markdownProps && typeof children === "string" ? <Markdown {...markdownProps}>{children}</Markdown> : children;

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

    const chatitem = (
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
            {displayShrinked && autoShrink ? (
                <OverflowText passDown>
                    <Markdown removeMarkup>{onlyText(content)}</Markdown>
                </OverflowText>
            ) : (
                content
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
            <FlexibleLayoutContainer noEqualItemSpace gapSize="tiny">
                {avatar && (
                    <FlexibleLayoutItem
                        className={`${eccgui}-chat__content-avatar`}
                        growFactor={0}
                        shrinkFactor={0}
                        style={alignment === "right" ? { order: 1 } : undefined}
                    >
                        {React.cloneElement(avatar, { size: "small", ratio: "1:1", rounded: true, resizing: "cover" })}
                    </FlexibleLayoutItem>
                )}
                <FlexibleLayoutItem className={`${eccgui}-chat__content-wrapper`}>{chatitem}</FlexibleLayoutItem>
                {(displayShrinked || onToggleSize || autoShrink) && (
                    <FlexibleLayoutItem
                        className={`${eccgui}-chat__content-sizetoggle`}
                        growFactor={0}
                        shrinkFactor={0}
                        style={alignment === "right" ? { order: -1 } : undefined}
                    >
                        <IconButton
                            name={displayShrinked ? "toggler-showmore" : "toggler-showless"}
                            onClick={() => toggleSize()}
                        />
                    </FlexibleLayoutItem>
                )}
            </FlexibleLayoutContainer>
        </div>
    );
};

export default ChatContent;
