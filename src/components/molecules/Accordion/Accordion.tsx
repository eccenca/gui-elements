import React, { ReactNode } from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { TestableComponent } from "@/components/interfaces";

import { AccordionContext, AccordionItemProps } from "./AccordionItem";

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">, TestableComponent {
    children?: ReactNode;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Position of the toggler icon relative to the item label.
     * `start` renders it in front of the label, `end` behind it.
     */
    align?: "start" | "end";
    /**
     * Disable user interaction with all items of the accordion.
     */
    disabled?: boolean;
    /**
     * Defines how much whitespace is used on top and bottom inside the header and content of an accordion item.
     */
    whitespaceSize?: AccordionItemProps["whitespaceSize"];
    /**
     * Defines how much space is used for the separation between an accordion item and the next one.
     */
    separationSize?: AccordionItemProps["separationSize"];
}

/**
 * The accordion groups a set of `AccordionItem` elements. Each item manages its own open
 * state independently, so multiple items can be expanded at the same time (the behaviour of
 * the former Carbon-based implementation).
 */
export const Accordion = ({
    children,
    className = "",
    align = "start",
    disabled = false,
    whitespaceSize = "medium",
    separationSize = "none",
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    ...otherProps
}: AccordionProps) => {
    return (
        <AccordionContext.Provider value={{ align, whitespaceSize, separationSize, disabled }}>
            <div
                className={cn(`${eccgui}-accordion__container`, className)}
                data-test-id={dataTestId}
                data-testid={dataTestid}
                {...otherProps}
            >
                {children}
            </div>
        </AccordionContext.Provider>
    );
};

export default Accordion;
