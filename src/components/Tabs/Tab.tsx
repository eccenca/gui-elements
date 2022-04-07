import React from 'react';
import {
    Tab as BlueprintTab,
    TabProps as BlueprintTabProps
} from "@blueprintjs/core";
import Color from "color";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import TabTitle, { TabTitleProps } from "./TabTitle";

export interface TabProps extends Omit<BlueprintTabProps, "title"> {
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

// Dummy as we cannot use it like that directly for now
export const TabDummyForStorybook = (props: TabProps) => { return <>{props.title}</>}

export const transformTabProperties = ({
    title,
    dontShrink=false,
    className="",
    backgroundColor,
    ...otherBlueprintTabProperties
}: TabProps) => {
    const flexStyles = dontShrink ? { flexShrink: 0} : {};
    let colorStyles = {};
    if (!!backgroundColor) {
        let color = Color("#ffffff")
        try {
            color = Color(backgroundColor);
        } catch(ex) {
            console.warn("Received invalid background color for tag: " + backgroundColor)
        }
        colorStyles = {
            backgroundColor: `${color.rgb().toString()}`,
            color: color.isLight() ? "#000" : "#fff",
        }
    }
    const extraStyles = (dontShrink || !!backgroundColor) ? {style: {...flexStyles, ...colorStyles}} : {};
    return {
        key: otherBlueprintTabProperties.id,
        className: className + ` ${eccgui}-tabs`,
        title: typeof title === "string" ? <TabTitle text={title} /> : title,
        ...otherBlueprintTabProperties,
        ...extraStyles
    }
}

/*

TODO: Try to overload the original Tab element. Currently it does not work
(at least inside Storybook) because the set displayName is overwritten and
Blueprints Tabs integration cannot match the new Tab element correctly by
checking the displayName.

const Tab = (tabProps: TabProps) => {
    return <BlueprintTab
        {...transformTabProperties(tabProps)}
    />;
}

Tab.displayName = BlueprintTab.displayName;
//*/

/*
import { AbstractPureComponent2, Classes } from "@blueprintjs/core";
class Tab extends AbstractPureComponent2<TabProps> {
    public static defaultProps: Partial<TabProps> = {
        disabled: false,
        //dontShrink: false,
    };

    constructor(props: TabProps) {
        //const { title, ...otherProps} = transformTabProperties(props);
        //const newProps = {...otherProps, title: props.title}
        //console.log(newProps);
        super(props);
    }

    public static displayName = BlueprintTab.displayName;

    // this component is never rendered directly; see BlueprintTabs#renderTabPanel()
    public render() {
        const { className, panel } = this.props;
        return (
            <div className={`${Classes.TAB_PANEL} ${className}`} role="tablist">
                {panel}
            </div>
        );
    }
}

//*
console.log(Tab.displayName);
export default Tab;
//*/

export default BlueprintTab;
