import React from "react";

import { TestableComponent } from "../../components/interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { FlexibleLayoutContainer, FlexibleLayoutContainerProps, FlexibleLayoutItem } from "./../FlexibleLayout";
import { Spacing, SpacingProps } from "./../Separation/Spacing";
import { ChatFieldProps } from "./ChatField";

export interface ChatAreaProps
    extends Omit<FlexibleLayoutContainerProps, "vertical" | "noEqualItemSpace">,
        TestableComponent {
    /**
     * The inut field for the chat.
     */
    chatField?: React.ReactElement<ChatFieldProps>;
    /**
     * Set the position of the chat field.
     */
    chatFieldPosition?: "top" | "bottom";
    /**
     * Sets the maximum width for chat contents and input.
     */
    contentWidth?: "small" | "medium" | "large" | "full";
    /**
     * Put chat content in a list and add spacings automatically.
     * Works best if each `ChatArea` child represents one chat content item.
     */
    autoSpacingSize?: SpacingProps["size"];
    /**
     * Scrolls content to the first or last child automatically.
     * The correct value depends on the place where you insert the most recent chat item.
     */
    autoScrollTo?: "first" | "last";
}

/**
 * Component to display a full chat, containing chat content bubbles and text input.
 */
export const ChatArea = ({
    children,
    className,
    chatField,
    chatFieldPosition = "bottom",
    contentWidth = "medium",
    autoSpacingSize,
    gapSize = "medium",
    autoScrollTo,
    ...otherFlexibleLayoutContainerProps
}: ChatAreaProps) => {
    const chatcontents = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (chatcontents.current && children && autoScrollTo) {
            const chatitems = chatcontents.current.getElementsByClassName(`${eccgui}-chat__content`);
            if (chatitems.length > 0) {
                chatitems[autoScrollTo === "first" ? 0 : chatitems.length - 1].scrollIntoView({
                    behavior: "instant",
                    block: autoScrollTo === "first" ? "start" : "end",
                });
            }
        }
    }, [chatcontents, children, autoScrollTo]);

    return (
        <FlexibleLayoutContainer
            className={
                `${eccgui}-chat__area` + ` ${eccgui}-chat__area--${contentWidth}` + (className ? ` ${className}` : "")
            }
            vertical
            noEqualItemSpace
            gapSize={gapSize}
            {...otherFlexibleLayoutContainerProps}
        >
            {chatField && (
                <FlexibleLayoutItem
                    growFactor={0}
                    shrinkFactor={0}
                    style={chatFieldPosition === "bottom" ? { order: 1 } : undefined}
                >
                    <div className={`${eccgui}-chat__area-contentwidth`}>{chatField}</div>
                </FlexibleLayoutItem>
            )}
            <FlexibleLayoutItem
                style={
                    otherFlexibleLayoutContainerProps.useAbsoluteSpace
                        ? {
                              overflow: "auto",
                              minHeight: 0,
                              padding: "2px 0",
                          }
                        : undefined
                }
            >
                <div className={`${eccgui}-chat__area-contentwidth`} ref={chatcontents}>
                    {autoSpacingSize && children ? (
                        <ul>
                            {React.Children.toArray(children).map((child, index) => (
                                <li key={index}>
                                    {child}
                                    <Spacing size={autoSpacingSize} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        children
                    )}
                </div>
            </FlexibleLayoutItem>
        </FlexibleLayoutContainer>
    );
};

export default ChatArea;
