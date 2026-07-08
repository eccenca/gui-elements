import React from "react";
import { ProgressBar as BlueprintProgressBar, ProgressBarProps as BlueprintProgressBarProps } from "@blueprintjs/core";
import classNames from "classnames";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ProgressBarProps extends Omit<BlueprintProgressBarProps, "intent"> {
    /**
     * Visual intent color to apply to element.
     */
    intent?: BlueprintProgressBarProps["intent"] | "accent";
}

export const ProgressBar = ({ className, intent, ...otherProps }: ProgressBarProps) => {
    return (
        <BlueprintProgressBar
            className={classNames(`${eccgui}-progressbar`, className, {
                [`${eccgui}-progressbar-intent-${intent}`]: intent,
            })}
            {...otherProps}
        />
    );
};

export default ProgressBar;
