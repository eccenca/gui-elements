import React from "react";
import { Tab as BlueprintTab, TabProps as BlueprintTabProps } from "@blueprintjs/core";
import Color from "color";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../interfaces";

import decideContrastColorValue from "./../../common/utils/colorDecideContrastvalue";
import TabTitle, { TabTitleProps } from "./TabTitle";

export interface TabProps extends TestableComponent, Omit<BlueprintTabProps, "title"> {
    /**
     * Title (or tab label).
     */
    title: string | React.ReactElement<TabTitleProps>;
    /**
     * Sets the background color of a tag, depends on the `Color` object provided by the
     * [npm color module](https://www.npmjs.com/package/color) v3. You can use it with
     * all allowed [CSS color values](https://developer.mozilla.org/de/docs/Web/CSS/color_value).
     *
     * The front color is set automatically, so the tag label is always readable.
     */
    backgroundColor?: Color | string;
    /**
     * In case of not enough space do not shrink this tab in its size.
     */
    dontShrink?: boolean;
}

export const transformTabProperties = ({
    title,
    dontShrink = false,
    className = "",
    backgroundColor,
    ...otherBlueprintTabProperties
}: TabProps) => {
    const flexStyles = dontShrink ? { flexShrink: 0 } : {};
    let colorStyles = {};
    if (backgroundColor) {
        let color = Color("#ffffff");
        try {
            color = Color(backgroundColor);
        } catch {
            // eslint-disable-next-line no-console
            console.warn("Tag received invalid backgroundColor property: " + backgroundColor);
        }
        colorStyles = {
            backgroundColor: `${color.rgb().toString()}`,
            color: decideContrastColorValue({ testColor: color }),
        };
    }
    const extraStyles = dontShrink || !!backgroundColor ? { style: { ...flexStyles, ...colorStyles } } : {};
    return {
        key: otherBlueprintTabProperties.id,
        className: className + ` ${eccgui}-tabs`,
        title: typeof title === "string" ? <TabTitle text={title} /> : title,
        ...otherBlueprintTabProperties,
        ...extraStyles,
    };
};

export const Tab = BlueprintTab;
export default Tab;
