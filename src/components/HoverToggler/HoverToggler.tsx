import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface HoverTogglerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    /**
     * Additional CSS class name.
     */
    className?: string;
    /**
     * The content that is shown when not hovered.
     */
    baseContent: JSX.Element;
    baseContentProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
    /**
     * The content that is shown when hovered.
     */
    hoverContent: JSX.Element;
    hoverContentProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
    /**
     * Display as inline element.
     */
    inline?: boolean;
}

/** Displays a specific element. Displays another element when hovered. */
export const HoverToggler = ({
    className = "",
    baseContent,
    baseContentProps,
    hoverContent,
    hoverContentProps,
    inline = false,
    style,
    ...otherProps
}: HoverTogglerProps) => {
    return (
        <div
            className={`${eccgui}-hovertoggler__wrapper` + (inline ? ` ${eccgui}-hovertoggler--inline` : "")}
            style={style}
        >
            <div className={`${eccgui}-hovertoggler` + (className ? ` ${className}` : "")} {...otherProps}>
                <div className={`${eccgui}-hovertoggler__basecontent`}>
                    <div className={`${eccgui}-hovertoggler__wrappercontent`} {...baseContentProps}>
                        {baseContent}
                    </div>
                </div>
                <div className={`${eccgui}-hovertoggler__hovercontent`}>
                    <div tabIndex={0} className={`${eccgui}-hovertoggler__wrappercontent`} {...hoverContentProps}>
                        {hoverContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HoverToggler;
