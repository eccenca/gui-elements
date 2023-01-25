import React from "react";
import BaseIcon, { BaseIconProps } from "./BaseIcon";
import { CarbonIconType } from "./canonicalIconNames"
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TestIconProps extends Omit<BaseIconProps, "iconComponent"> {
    /**
     * Carbon icon that is used instead of the via `name` defined canonical named icon.
     */
    tryout: CarbonIconType;
}

/**
 * This component is primarily provided to test icons in a third application without defining them via a canonical name before.
 *
 * Example usage:
 * ```
 * import { LogoReact } from "@carbon/icons-react";
 * const testIcon = <TestIcon tryout={LogoReact} />
 * ```
 */
function TestIcon({
    className = "",
    tryout,
    ...otherBaseIconProps
}: TestIconProps) {
    return (
        <BaseIcon
            iconComponent={tryout}
            className={
                `${eccgui}-icon--test` +
                (className ? ` ${className}` : "")
            }
            {...otherBaseIconProps}
        />
    );
}

export default TestIcon;
