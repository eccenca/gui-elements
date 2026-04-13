import React from "react";

import { Markdown } from "../../cmem/markdown/Markdown";
import { IconButton } from "../Icon/IconButton";
import { TextReducer, TextReducerProps } from "../TextReducer/TextReducer";

import { ChatContentProps } from "./ChatContent";

export interface ChatContentCollapsedProps {
    children: React.ReactElement<ChatContentProps>;
    /**
     * Set this to `false` if the compoment should initally start in an expanded state.
     */
    collapsed?: boolean;
    /**
     * Use this to set extra `TextReducer` properties.
     * This is used to create the collapsed variant of the given content.
     */
    textReducerProps?: Omit<TextReducerProps, "children">;
    /**
     * Text for collapse button.
     */
    textCollapse?: string;
    /**
     * Text for expand button.
     */
    textExpand?: string;
}

/**
 * Adds an auto collapsing feature for convenience to `ChatContent`.
 */
export const ChatContentCollapsed = ({
    children,
    collapsed = true,
    textReducerProps = {},
    textCollapse = "Collapse",
    textExpand = "Expand",
}: ChatContentCollapsedProps) => {
    const [displayCollapsed, setDispayCollapsed] = React.useState<boolean>(collapsed);

    const childrenAsTextline = (
        <TextReducer useOverflowTextWrapper {...textReducerProps}>
            {typeof children.props.children === "string" ? (
                <Markdown>{children.props.children}</Markdown>
            ) : (
                children.props.children
            )}
        </TextReducer>
    );

    return React.cloneElement(children, {
        children: displayCollapsed ? childrenAsTextline : children.props.children,
        actionButton: (
            <IconButton
                text={displayCollapsed ? textExpand : textCollapse}
                name={displayCollapsed ? "toggler-showmore" : "toggler-showless"}
                onClick={() => setDispayCollapsed(!displayCollapsed)}
            />
        ),
    });
};

export default ChatContentCollapsed;
