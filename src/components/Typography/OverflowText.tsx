import React from "react";

import { cn } from "../../common/utils/cn";
import { TestableComponent } from "../../components/interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface OverflowTextProps extends React.HTMLAttributes<HTMLElement>, TestableComponent {
    /**
     * How is ellipsis used to cut text overflows.
     * Use `reverse`to use the ellipis on text start and display the end of the text.
     */
    ellipsis?: "add" | "reverse" | "none";
    /**
     * Display component as inline element.
     */
    inline?: boolean;
    /**
     * Using text overflow on all children elements.
     */
    passDown?: boolean;
    /**
     * Additional CSS class name.
     */
    className?: string;
    /**
     * HTML element that is used for the component.
     */
    useHtmlElement?: "p" | "div" | "span";
}

/** Prevents text from overflowing. */
export const OverflowText = ({
    className = "",
    children,
    ellipsis = "add",
    inline = false,
    passDown = false,
    useHtmlElement,
    ...otherProps
}: OverflowTextProps) => {
    const defaultHtmlElement = inline ? "span" : "div";
    const overflowtextElement = useHtmlElement
        ? React.createElement(useHtmlElement)
        : React.createElement(defaultHtmlElement);

    // "add" (default) and "reverse" both cut with an ellipsis (`--ellipsis-reverse` additionally flips
    // direction/pseudo-content via the legacy classname's CSS below); "none" clips instead.
    const truncationClasses = ellipsis === "none" ? "overflow-hidden whitespace-nowrap text-clip" : "truncate";
    const passdownTruncationClasses =
        ellipsis === "none"
            ? "[&_*]:overflow-hidden [&_*]:whitespace-nowrap [&_*]:text-clip"
            : "[&_*]:truncate";

    return (
        <overflowtextElement.type
            {...otherProps}
            className={cn(
                `${eccgui}-typography__overflowtext`,
                "max-w-full align-middle break-normal",
                truncationClasses,
                ellipsis === "none" && `${eccgui}-typography__overflowtext--ellipsis-none`,
                ellipsis === "reverse" && `${eccgui}-typography__overflowtext--ellipsis-reverse`,
                inline && `${eccgui}-typography__overflowtext--inline inline-block`,
                passDown && `${eccgui}-typography__overflowtext--passdown [&_*]:max-w-full [&_*]:align-middle`,
                passDown && passdownTruncationClasses,
                passDown && inline && "[&_*]:inline",
                className,
            )}
        >
            {children}
        </overflowtextElement.type>
    );
};

export default OverflowText;
