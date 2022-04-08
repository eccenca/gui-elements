import React from 'react';
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Button from "../Button/Button";

export interface TabTitleProps {
    /**
     * Content of the label that is displayed in the tab element.
     */
    text: string | React.ReactNode;
    /**
     * Content that is displayed before the tab label, could be used for icons, change markers, etc.
     * Use text content inside `<span>` element to force white space between th eprefix and the label.
     */
    titlePrefix?: React.ReactNode;
    /**
     * Content that is display after tab label, could be used for counts or close/remove buttons.
     * Use text content inside `<span>` element to force white space between th eprefix and the label.
     */
    titleSuffix?: React.ReactNode;
    /**
     * Enable larger display of the tab.
     */
    large?: boolean;
    /**
     * Enable smaller display of the tab.
     */
    small?: boolean;
    /**
     * Add a tooltip to a tab, displayed when user hoveres over it.
     */
    tooltip?: string | JSX.Element;
    /**
     * Make the tab not usable, display is also narrowed.
     */
    disabled?: boolean;
}

/**
 * Gives control about functionality and layout of the tab titles.
 */
const TabTitle = ({
    text,
    tooltip,
    titlePrefix,
    titleSuffix,
    large=false,
    small=false,
    disabled=false,
}: TabTitleProps) => {
    return (
        <Button
            className={`${eccgui}-tabtitle`}
            minimal
            tabIndex={-1}
            text={text}
            tooltip={disabled ? undefined : tooltip}
            icon={<>{titlePrefix}</>}
            rightIcon={<>{titleSuffix}</>}
            small={small}
            large={large}
            disabled={disabled}
        />
    );
};

export default TabTitle;
