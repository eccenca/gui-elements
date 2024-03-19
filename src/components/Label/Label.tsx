import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "../Icon/Icon";
import Tooltip, { TooltipProps } from "../Tooltip/Tooltip";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    /**
     * Label text.
     */
    text?: string | JSX.Element;
    /**
     * Short info about label semantic, it is displayed in parentesis after the label text.
     */
    info?: string | JSX.Element;
    /**
     * Additional tooltip, attached to an info icon that is displayed after the info.
     */
    tooltip?: string | JSX.Element;
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
        </>
    );

    return !!text || !!info || !!tooltip || !!children ? (
        React.createElement(
            htmlElementstring,
            {
                className:
                    `${eccgui}-label` +
                    (className ? " " + className : "") +
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
