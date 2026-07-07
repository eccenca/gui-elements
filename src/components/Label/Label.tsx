import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "../Icon/Icon";
import Spacing from "../Separation/Spacing";
import Tooltip, { TooltipProps } from "../Tooltip/Tooltip";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    /**
     * Label text.
     */
    text?: string | React.JSX.Element;
    /**
     * Short info about label semantic, it is displayed in parentesis after the label text.
     */
    info?: string | React.JSX.Element;
    /**
     * Additional tooltip, attached to an info icon that is displayed after the info.
     */
    tooltip?: string | React.JSX.Element;
    /**
     * Additonal tooltip properties, e.g. `hoverOpenDelay`.
     */
    tooltipProps?: Partial<Omit<TooltipProps, "content" | "children" | "disabled">>;
    /**
     * Set the name of an HTML element if the display should be used for something else that a `label` element.
     */
    isLayoutForElement?: string;
    /**
     * Label is displayed inactive.
     * If there is no `isLayoutForElement` set then a `span` is used.
     */
    disabled?: boolean;
    /**
     * visual appearance of the label
     */
    emphasis?: "strong" | "normal";
    /**
     * Add other elements to the end of the label content
     */
    additionalElements?: React.ReactNode | React.ReactNode[];
    /** Force label to get displayed as inline block element. */
    inline?: boolean;
}

export const Label = ({
    children,
    className = "",
    disabled,
    text,
    info,
    tooltip,
    tooltipProps,
    isLayoutForElement = "label",
    emphasis = "normal",
    additionalElements,
    inline,
    ...otherLabelProps
}: LabelProps) => {
    let htmlElementstring = isLayoutForElement;
    htmlElementstring = disabled && htmlElementstring === "label" ? "span" : htmlElementstring;

    const labelContent = (
        <>
            {text && (
                <span
                    className={cn(`${eccgui}-label__text`, emphasis === "strong" && "font-semibold")}
                >
                    {text}
                </span>
            )}
            {info && (
                <span
                    className={cn(
                        `${eccgui}-label__info`,
                        "text-muted-foreground before:content-['('] after:content-[')']",
                        // was: `.eccgui-label__text + & { margin-left: ... }`; `text` always renders first
                        // when both are given, so a direct prop check reproduces the adjacent-sibling rule.
                        text && "ml-1",
                    )}
                >
                    {info}
                </span>
            )}
            {tooltip && (
                <span
                    className={cn(
                        `${eccgui}-label__tooltip`,
                        "text-muted-foreground",
                        // was: `.eccgui-label__text + &, .eccgui-label__info + & { margin-left: ... }`
                        (text || info) && "ml-1",
                    )}
                >
                    <Tooltip content={tooltip} disabled={disabled} {...tooltipProps}>
                        <Icon name="item-info" small />
                    </Tooltip>
                </span>
            )}
            {children && (
                <span className={cn(`${eccgui}-label__other`, "inline-block ml-2")}>{children}</span>
            )}
            {additionalElements && (
                <>
                    <Spacing vertical size="tiny" />
                    {additionalElements}
                </>
            )}
        </>
    );

    return !!text || !!info || !!tooltip || !!children || !!additionalElements ? (
        React.createElement(
            htmlElementstring,
            {
                className: cn(
                    `${eccgui}-label`,
                    `${eccgui}-label--${emphasis}`,
                    "text-sm font-medium leading-none text-foreground",
                    inline ? `${eccgui}-label--inline inline-block align-middle` : "block",
                    disabled && `${eccgui}-label--disabled opacity-50`,
                    className,
                ),
                ...otherLabelProps,
            },
            labelContent,
        )
    ) : (
        <></>
    );
};

export default Label;
