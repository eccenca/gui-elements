import React from "react";

import { Markdown, MarkdownProps } from "@/cmem/markdown/Markdown";
import { cn } from "@/common/utils/cn";
import { FlexibleLayoutContainer, FlexibleLayoutItem } from "@/components/atoms/FlexibleLayout";
import { IconButtonProps } from "@/components/atoms/Icon/IconButton";
import { Spacing } from "@/components/atoms/Separation/Spacing";
import { HtmlContentBlock, OverflowTextProps } from "@/components/atoms/Typography";
import { TestableComponent } from "@/components/interfaces";
import { ContextMenuProps } from "@/components/molecules/ContextOverlay/ContextMenu";
import { DepictionProps } from "@/components/molecules/Depiction/Depiction";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

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
    /**
     * Could be used to add some type of toggle button or to include a context menu.
     */
    actionButton?: React.ReactElement<IconButtonProps> | React.ReactElement<ContextMenuProps>;
}

/**
 * Component to display single chat contents, including avatar and status line.
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
    actionButton,
    ...otherDivProps
}: ChatContentProps) => {
    const content =
        markdownProps && typeof children === "string" ? <Markdown {...markdownProps}>{children}</Markdown> : children;

    // shadcn bubble surface: `bg-muted` fill + hairline `--border` ring (replaces the former Blueprint
    // elevation shadow). Both incoming/outgoing bubbles share `--muted` (as the previous scss did); the
    // decorative tail/beak of the old bubble is intentionally dropped, so `bubble`/`simple` look alike.
    const displayTypeClass: Record<"free" | "simple" | "bubble", string> = {
        free: "bg-transparent px-0 py-px shadow-none",
        simple: "",
        bubble: "",
    };

    const chatitem = (
        <div
            className={cn(
                "relative z-0 min-h-9 overflow-auto rounded-lg bg-muted px-3 py-2 text-sm shadow-[0_0_0_1px_var(--border)]",
                displayTypeClass[displayType],
                limitHeight && "max-h-[50vh]",
                // frozen `eccgui-*` classname contract
                `${eccgui}-chat__content`,
                `${eccgui}-chat__content--display-${displayType}`,
                `${eccgui}-chat__content--align-${alignment}`,
                limitHeight && `${eccgui}-chat__content--limitheight`,
                className,
            )}
            {...otherDivProps}
        >
            {statusLine && (
                <HtmlContentBlock small>
                    {statusLine}
                    <Spacing size="tiny" />
                </HtmlContentBlock>
            )}
            {content}
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
                {actionButton && (
                    <FlexibleLayoutItem
                        className={`${eccgui}-chat__content-sizetoggle`}
                        growFactor={0}
                        shrinkFactor={0}
                        style={alignment === "right" ? { order: -1 } : undefined}
                    >
                        {actionButton}
                    </FlexibleLayoutItem>
                )}
            </FlexibleLayoutContainer>
        </div>
    );
};

export default ChatContent;
