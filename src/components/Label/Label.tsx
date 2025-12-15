import React from "react";

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
            {text && <span className={`${eccgui}-label__text`}>{text}</span>}
            {info && <span className={`${eccgui}-label__info`}>{info}</span>}
            {tooltip && (
                <span className={`${eccgui}-label__tooltip`}>
                    <Tooltip content={tooltip} disabled={disabled} {...tooltipProps}>
                        <Icon name="item-info" small />
                    </Tooltip>
                </span>
            )}
            {children && <span className={`${eccgui}-label__other`}>{children}</span>}
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
                className:
                    `${eccgui}-label ${eccgui}-label--${emphasis}` +
                    (className ? " " + className : "") +
                    (inline ? ` ${eccgui}-label--inline` : "") +
                    (disabled ? ` ${eccgui}-label--disabled` : ""),
                ...otherLabelProps,
            },
            labelContent
        )
    ) : (
        <></>
    );
};

export default Label;
