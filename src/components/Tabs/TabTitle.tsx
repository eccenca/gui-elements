import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Tooltip from "../Tooltip/Tooltip";

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
    tooltip?: string | React.JSX.Element;
    /**
     * Make the tab not usable, display is also narrowed.
     */
    disabled?: boolean;
}

/**
 * Gives control about functionality and layout of the tab titles.
 *
 * Renders the tab's content (prefix/icon, label, suffix) directly, without an interactive
 * wrapper: it is always placed inside a Radix `TabsTrigger` (see `Tabs.tsx` / `Tab.tsx`), which
 * is already the single focusable/interactive element of the tab, and which also owns the
 * active/inactive text color and the line-variant underline. `TabTitle` therefore only
 * contributes the stock trigger typography (`font-medium`, `text-sm` or, for `small`, `text-xs`)
 * and layout, not color or decoration.
 */
export const TabTitle = ({ text, tooltip, titlePrefix, titleSuffix, small = false, disabled = false }: TabTitleProps) => {
    const content = (
        <span
            className={cn(
                `${eccgui}-tabtitle`,
                "inline-flex min-w-0 items-center gap-1.5 font-medium",
                small ? "text-xs" : "text-sm",
                disabled && "opacity-50",
            )}
        >
            {titlePrefix}
            <span className={cn(`${eccgui}-tabtitle__text`, "min-w-0")}>{text}</span>
            {titleSuffix}
        </span>
    );

    return tooltip && !disabled ? <Tooltip content={tooltip}>{content}</Tooltip> : content;
};

export default TabTitle;
