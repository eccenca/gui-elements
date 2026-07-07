import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import BaseIcon, { BaseIconProps } from "./BaseIcon";
import { IconComponentType } from "./canonicalIconNames";

export interface TestIconProps extends Omit<BaseIconProps, "iconComponent"> {
    /**
     * Icon component that is used instead of the via `name` defined canonical named icon.
     * This is a Lucide icon (or any compatible forward-ref SVG component).
     */
    tryout: IconComponentType;
}

/**
 * This component is primarily provided to test icons in a third application without defining them via a canonical name before.
 *
 * Example usage:
 * ```
 * import { Rocket } from "lucide-react";
 * import { TestIcon } from "@eccenca/gui-elements";
 * const testIcon = <TestIcon tryout={Rocket} />;
 * ```
 */
export const TestIcon = ({ className = "", tryout, ...otherBaseIconProps }: TestIconProps) => {
    return (
        <BaseIcon
            iconComponent={tryout}
            className={`${eccgui}-icon--test` + (className ? ` ${className}` : "")}
            {...otherBaseIconProps}
        />
    );
};

export default TestIcon;
