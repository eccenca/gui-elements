import React from "react";
import Color, { ColorLike } from "color";

import decideContrastColorValue from "@/common/utils/colorDecideContrastvalue";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import TabTitle, { TabTitleProps } from "./TabTitle";

/**
 * Identifier of a single tab. Mirrors the historical BlueprintJS `TabId` type so the
 * public API stays frozen while the implementation moves to Radix.
 */
export type TabId = string | number;

export interface TabProps extends TestableComponent, Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "title"> {
    /**
     * Unique identifier used to control which tab is selected
     * and to generate ARIA attributes for accessibility.
     */
    id: TabId;
    /**
     * Title (or tab label).
     */
    title: string | React.ReactElement<TabTitleProps>;
    /**
     * Panel content, rendered by the parent `Tabs` when this tab is active.
     * If omitted, no panel will be rendered for this tab.
     */
    panel?: React.JSX.Element;
    /**
     * Space-delimited string of class names applied to tab panel container.
     */
    panelClassName?: string;
    /**
     * Whether the tab is disabled.
     */
    disabled?: boolean;
    /**
     * Sets the background color of a tag, depends on the `Color` object provided by the
     * [npm color module](https://www.npmjs.com/package/color) v3. You can use it with
     * all allowed [CSS color values](https://developer.mozilla.org/de/docs/Web/CSS/color_value).
     *
     * The front color is set automatically, so the tag label is always readable.
     */
    backgroundColor?: ColorLike;
    /**
     * In case of not enough space do not shrink this tab in its size.
     */
    dontShrink?: boolean;
}

/**
 * Normalizes a single {@link TabProps} entry into the values consumed by the Radix-based
 * `<Tabs />` container: the (possibly wrapped) title node, the merged inline styles for the
 * `dontShrink` / `backgroundColor` flags, and all remaining tab properties.
 */
export const transformTabProperties = ({
    title,
    dontShrink = false,
    className = "",
    backgroundColor,
    ...otherTabProperties
}: TabProps) => {
    const flexStyles: React.CSSProperties = dontShrink ? { flexShrink: 0 } : {};
    let colorStyles: React.CSSProperties = {};
    if (backgroundColor) {
        let color = Color("#ffffff");
        try {
            color = Color(backgroundColor);
        } catch {
            console.warn("Tab received invalid backgroundColor property: " + backgroundColor);
        }
        colorStyles = {
            backgroundColor: `${color.rgb().toString()}`,
            color: decideContrastColorValue({ testColor: color }),
        };
    }
    const hasComputedStyle = dontShrink || !!backgroundColor;
    return {
        ...otherTabProperties,
        key: otherTabProperties.id,
        className,
        title: typeof title === "string" ? <TabTitle text={title} /> : title,
        style: hasComputedStyle
            ? { ...(otherTabProperties.style ?? {}), ...flexStyles, ...colorStyles }
            : otherTabProperties.style,
    };
};

/**
 * Data-only representation of a single tab.
 *
 * Tabs are always described through the `tabs` array of the `<Tabs />` container (which reads
 * their properties and renders the Radix structure itself); rendering a `<Tab />` element on its
 * own produces no output. It is kept as a named/typed export for backwards compatibility.
 */
export const Tab = (_props: TabProps): React.JSX.Element | null => null;
Tab.displayName = `${eccgui}-Tab`;

export default Tab;
