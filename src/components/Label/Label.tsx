import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Tooltip from "../Tooltip/Tooltip";
import Icon from "../Icon/Icon";

function Label({
    children,
    className = "",
    disabled,
    text,
    info,
    tooltip,
    tooltipProperties,
    isLayoutForElement = "label",
    ...otherProps
}: any) {
    let htmlElementstring = isLayoutForElement;
    htmlElementstring = disabled && htmlElementstring === "label" ? "span" : htmlElementstring;
    const labelElement = React.createElement(htmlElementstring);

    return text ? (
        <labelElement.type
            className={`${eccgui}-label` + (className ? " " + className : "") + (disabled ? ` ${eccgui}-label--disabled` : "")}
            {...otherProps}
            htmlFor={disabled ? "" : otherProps.htmlFor}
        >
            <span className={`${eccgui}-label__text`}>{text}</span>
            {info && <span className={`${eccgui}-label__info`}>{info}</span>}
            {tooltip && (
                <span className={`${eccgui}-label__tooltip`}>
                    <Tooltip content={tooltip} disabled={disabled} {...tooltipProperties}>
                        <Icon name="item-info" small />
                    </Tooltip>
                </span>
            )}
            {children && <span className={`${eccgui}-label__other`}>{children}</span>}
        </labelElement.type>
    ) : (
        <></>
    );
}

export default Label;
