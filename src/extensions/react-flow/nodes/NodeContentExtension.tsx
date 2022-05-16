import React from "react";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import IconButton from "../../../components/Icon/IconButton";

export interface NodeContentExtensionProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * When enabled the element is displayed in a way that it does not count into the node size calculation.
     */
    slideOutOfNode?: boolean;
    /**
     * Element is displayed in expanded state.
     * If it has no `onToggle` handler property set then it is always expanded.
     */
    isExpanded?: boolean;
    /**
     * Click handler to manage the expanded state from outside the the element.
     * This state is not managed automatically by the element itself.
     */
    onToggle?: (event: React.MouseEvent<HTMLElement>, isExpanded: boolean) => void;
    /**
     * Single element or aray of `IconButton` and `Button` elements.
     * They will be displayed beside the closing button under the element content body.
     */
    actionButtons?: React.ReactNode | React.ReactNode[];
    /**
     * Tooltip text for expand button.
     */
    tooltipExpand?: string;
    /**
     * Tooltip text for expand button.
     */
    tooltipReduce?: string;
}

/**
 * Displays an content area that can be attached to `NodeContent` elements.
 */
export const NodeContentExtension = ({
    children,
    slideOutOfNode = false,
    isExpanded = false,
    onToggle = undefined,
    actionButtons,
    tooltipExpand = "Show more",
    tooltipReduce = "Show less",
    // other props for DOM element
    ...otherProps
}: NodeContentExtensionProps) => {

    // always expand element if there is no handler to manage it
    const expanded = onToggle ? isExpanded : true;

    return (
        <div
            {...otherProps}
            className={
                `${eccgui}-graphviz__node__extension` +
                (slideOutOfNode ? ` ${eccgui}-graphviz__node__extension--slideout` : "") +
                (expanded ? ` ${eccgui}-graphviz__node__extension--expanded` : "")
            }
        >
            {
                !expanded && onToggle && (
                    <IconButton
                        className={`${eccgui}-graphviz__node__extension-expandbutton`}
                        name="item-vertmenu"
                        text={tooltipExpand}
                        onClick={(e) => { onToggle(e, expanded); }}
                    />
                )
            }
            {
                expanded && (
                    <>
                        <div className={`${eccgui}-graphviz__node__extension-body`}>
                            {children}
                        </div>
                        {(!!actionButtons || !!onToggle) && (
                            <div className={`${eccgui}-graphviz__node__extension-actions`}>
                                <IconButton
                                    className={`${eccgui}-graphviz__node__extension-reducebutton`}
                                    name="toggler-showless"
                                    text={tooltipReduce}
                                    onClick={onToggle ? (e) => { onToggle(e, expanded); } : undefined}
                                />
                                {actionButtons}
                            </div>
                        )}
                    </>
                )
            }
        </div>
    );
}
