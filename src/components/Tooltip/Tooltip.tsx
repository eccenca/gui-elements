import React from "react";
import { Classes as BlueprintClassNames, Tooltip as BlueprintTooltip } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Tooltip({ children, className = "", addIndicator = false, ...otherProps }: any) {
    return (
        <BlueprintTooltip
            lazy={true}
            hoverOpenDelay={500}
            {...otherProps}
            className={
                `${eccgui}-tooltip__wrapper` +
                (className ? " " + className : "") +
                (addIndicator === true ? " " + BlueprintClassNames.TOOLTIP_INDICATOR : "")
            }
            targetClassName={`${eccgui}-tooltip__target` + (className ? " " + className + "__target" : "")}
            popoverClassName={`${eccgui}-tooltip__content` + (className ? " " + className + "__content" : "")}
        >
            {children}
        </BlueprintTooltip>
    );
}

export default Tooltip;
