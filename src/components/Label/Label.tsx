import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Tooltip, { TooltipProps } from "../Tooltip/Tooltip";
import Icon from "../Icon/Icon";

export interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
    text?: string | JSX.Element;
    info?: string | JSX.Element;
    tooltip?: string | JSX.Element;
    tooltipProps?: Partial<Omit<TooltipProps, "content" | "children" | "disabled">>;
    isLayoutForElement?: string;
    disabled?: boolean;
}

function Label({
    children,
    className = "",
    disabled,
    text,
    info,
    tooltip,
    tooltipProps,
    isLayoutForElement = "label",
    ...otherLabelProps
}: LabelProps) {
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

    return (!!text || !!info || !!tooltip || !!children) ? React.createElement(
        htmlElementstring,
        {
            className: `${eccgui}-label` + (className ? " " + className : "") + (disabled ? ` ${eccgui}-label--disabled` : ""),
            ...otherLabelProps,
        },
        labelContent
    ) : (
        <></>
    )
}

export default Label;
