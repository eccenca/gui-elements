import React from 'react';
import {
    Tabs as BlueprintTabs,
    TabsProps as BlueprintTabsProps,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Tab, { TabProps, transformTabProperties } from "./Tab";

interface TabsProps extends Omit<BlueprintTabsProps, "vertical" | "large" | "animate"> {
    children?: React.ReactNode;
    /**
     * Data structure containing all tabs, including their titles and content panels.
     * Currently it is not possible to add `Tab` elements direct as children elements to the `<Tabs>` container.
     */
    tabs?: TabProps[];
    /**
     * Allow scrollbars on the tabs header.
     * Otherwise they will be shrinked if not enough space.
     */
    allowScrollbars?: boolean;
}

function Tabs(
    {
        tabs=[],
        children,
        className = "",
        allowScrollbars,
        ...restProps
    }: TabsProps) {

    // TODO React.Children.toArray(children).forEach((e) => {console.log(e)});

    return (
        <BlueprintTabs
            className={
                className +
                ` ${eccgui}-tabs` +
                (allowScrollbars ? ` ${eccgui}-tabs--scrollablelist` : "")
            }
            {...restProps}
            animate={false}
        >
            {!!tabs ? (
                tabs.map(tab => {
                    const e = <Tab {...transformTabProperties(tab)} />;
                    // TODO console.log(e);
                    return e;
                })
            ) : (
                children
            )}
        </BlueprintTabs>
    );
};

export default Tabs;
