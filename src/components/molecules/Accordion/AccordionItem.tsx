import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/common/utils/cn";
import { Icon } from "@/components/atoms/Icon/Icon";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

type sizeOptions = "none" | "small" | "medium" | "large";

/**
 * Configuration shared from the surrounding `Accordion` to each `AccordionItem`.
 * A single item may override the whitespace/separation settings via its own props.
 */
export interface AccordionContextValue {
    align: "start" | "end";
    whitespaceSize: sizeOptions | { header: sizeOptions; content: sizeOptions };
    separationSize: sizeOptions;
    disabled: boolean;
}

export const AccordionContext = React.createContext<AccordionContextValue>({
    align: "start",
    whitespaceSize: "medium",
    separationSize: "none",
    disabled: false,
});

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, TestableComponent {
    /**
     * additional user class name
     */
    className?: string;
    /**
     * header of accordion item
     */
    label: string | React.JSX.Element;
    /**
     * use full available width for content
     */
    fullWidth?: boolean;
    /**
     * Defines how much whitespace is used on top and bottom inside the header and content of an accordion item.
     * Seeting on `AccordionItem` overwrites the global setting on `Accordion`.
     */
    whitespaceSize?: sizeOptions | { header: sizeOptions; content: sizeOptions };
    /**
     * Defines how much space is used for the separation between the accordion item and the next one.
     */
    separationSize?: sizeOptions;
    /**
     * do not use borders as visible separations on accordion item
     */
    noBorder?: boolean;
    /**
     * highlight accordion item by different background color
     */
    elevated?: boolean;
    /**
     * Whether the item is expanded. The value re-syncs whenever this prop changes, but the
     * user can still toggle the item locally by clicking its header (matching the former
     * Carbon behaviour).
     */
    open?: boolean;
    /**
     * disable user interaction with this accordion item
     */
    disabled?: boolean;
    /**
     * Callback fired when the item header is clicked, carrying the resulting open state.
     */
    onHeadingClick?: (state: { isOpen: boolean; event: React.MouseEvent<HTMLElement> }) => void;
}

// Vertical whitespace of the clickable header, per size step.
const headerSpaceClass: Record<sizeOptions, string> = {
    none: "py-0.5",
    small: "py-1",
    medium: "py-2",
    large: "py-3",
};

// Vertical whitespace of the expanded content, per size step.
const contentSpaceClass: Record<sizeOptions, string> = {
    none: "pb-1 pt-0",
    small: "pb-2 pt-0.5",
    medium: "pb-3 pt-1",
    large: "pb-4 pt-2",
};

// Bottom margin used to separate an item from the following one, per size step.
const separationClass: Record<sizeOptions, string> = {
    none: "",
    small: "mb-1",
    medium: "mb-2",
    large: "mb-3",
};

// Fixed value of the single Radix item nested inside each self-contained accordion item.
const ITEM_VALUE = "item";

export const AccordionItem = ({
    children,
    label,
    className = "",
    fullWidth = false,
    elevated = false,
    whitespaceSize,
    separationSize,
    noBorder = false,
    open = false,
    disabled,
    onHeadingClick,
    "data-test-id": dataTestId,
    "data-testid": dataTestid,
    ...otherProps
}: AccordionItemProps) => {
    const ctx = React.useContext(AccordionContext);
    const resolvedWhitespace = whitespaceSize ?? ctx.whitespaceSize;
    const resolvedSeparation = separationSize ?? ctx.separationSize;
    const headerWhitespaceSize =
        typeof resolvedWhitespace === "string" ? resolvedWhitespace : resolvedWhitespace.header;
    const contentWhitespaceSize =
        typeof resolvedWhitespace === "string" ? resolvedWhitespace : resolvedWhitespace.content;
    const isDisabled = disabled ?? ctx.disabled;
    const alignEnd = ctx.align === "end";

    // Faithful replica of the former Carbon `AccordionItem` open handling: seed the local
    // state from `open`, re-sync it whenever the `open` prop changes, but still allow the
    // user to toggle the item by clicking its header.
    const [isOpen, setIsOpen] = React.useState<boolean>(open);
    const [prevOpen, setPrevOpen] = React.useState<boolean>(open);
    if (open !== prevOpen) {
        setPrevOpen(open);
        setIsOpen(open);
    }

    const handleValueChange = (value: string) => {
        setIsOpen(value === ITEM_VALUE);
    };

    return (
        <div
            className={cn(
                `${eccgui}-accordion__item`,
                !noBorder && "border-b border-border",
                elevated && `${eccgui}-accordion__item--elevated bg-muted`,
                fullWidth && `${eccgui}-accordion__item--fullwidth`,
                noBorder && `${eccgui}-accordion__item--noborder`,
                separationClass[resolvedSeparation],
                className,
            )}
            data-test-id={dataTestId}
            data-testid={dataTestid}
            {...otherProps}
        >
            <AccordionPrimitive.Root
                type="single"
                collapsible
                value={isOpen ? ITEM_VALUE : ""}
                onValueChange={handleValueChange}
                disabled={isDisabled}
            >
                <AccordionPrimitive.Item value={ITEM_VALUE} className="border-none">
                    <AccordionPrimitive.Header className="flex">
                        <AccordionPrimitive.Trigger
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                                onHeadingClick?.({ isOpen: !isOpen, event })
                            }
                            className={cn(
                                `${eccgui}-accordion__heading`,
                                "flex flex-1 items-center gap-2 px-2 text-left font-medium text-foreground outline-none transition-colors",
                                "hover:bg-accent/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
                                // NOTE: target the arrow via `>svg` (stock shadcn accordion pattern) — BEM
                                // classnames with `__` cannot be used in arbitrary variants (Tailwind converts
                                // `_` to a space).
                                "[&>svg]:shrink-0 [&>svg]:transition-transform [&[data-state=open]>svg]:rotate-180",
                                headerSpaceClass[headerWhitespaceSize],
                                alignEnd && "flex-row-reverse",
                            )}
                        >
                            <Icon name="toggler-showmore" className={`${eccgui}-accordion__arrow`} small />
                            <span className={cn(`${eccgui}-accordion__title`, "min-w-0 flex-1")}>{label}</span>
                        </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionPrimitive.Content
                        className={cn(
                            `${eccgui}-accordion__content`,
                            "overflow-hidden",
                            "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                        )}
                    >
                        <div className={cn(contentSpaceClass[contentWhitespaceSize], fullWidth ? "px-0" : "px-2")}>
                            {children}
                        </div>
                    </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
            </AccordionPrimitive.Root>
        </div>
    );
};

export default AccordionItem;
