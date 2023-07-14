import React from "react";
import { Classes } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Addicional CSS class name.
     */
    className?: string,
    /**
     * `id` of the tab element that is connected to this panel content.
     */
    labelledBy?: string,
    /**
     * Tab panel is not displayed.
     */
    hidden?: boolean,
}

/**
 * Element to display the content related to a tab.
 * This could be used if `<Tabs />` is used in uncontrolled mode.
 */
export const TabPanel = ({
    children,
    className = "",
    labelledBy,
    hidden = false,
    ...otherDivProps
}: TabPanelProps) => {
    return (
        <div
            {...otherDivProps}
            className={`${Classes.TAB_PANEL} ${eccgui}-tab__panel ${className}`}
            aria-labelledby={labelledBy}
            aria-hidden={hidden}
        >
            { children }
        </div>
    )
}

export default TabPanel;
