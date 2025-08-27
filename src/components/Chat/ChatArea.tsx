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
     * Put in chat content in a list and add spacings automatically.
     * Works best if each child represents one chat content item.
     */
    autoSpacingSize?: SpacingProps["size"];
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
    ...otherFlexibleLayoutContainerProps
}: ChatAreaProps) => {
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
                    className={`${eccgui}-chat__area-contents`}
                    growFactor={0}
                    shrinkFactor={0}
                    style={chatFieldPosition === "bottom" ? { order: 1 } : undefined}
                >
                    {chatField}
                </FlexibleLayoutItem>
            )}
            <FlexibleLayoutItem
                className={`${eccgui}-chat__area-contents`}
                style={
                    otherFlexibleLayoutContainerProps.useAbsoluteSpace
                        ? {
                              overflow: "auto",
                              minHeight: 0,
                              paddingRight: "0.25rem",
                          }
                        : undefined
                }
            >
                {autoSpacingSize && children ? (
                    <ul>
                        {React.Children.toArray(children).map((child) => (
                            <li>
                                {child}
                                <Spacing size={autoSpacingSize} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    children
                )}
            </FlexibleLayoutItem>
        </FlexibleLayoutContainer>
    );
};

export default ChatArea;
