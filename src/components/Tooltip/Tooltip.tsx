import React from "react";
import {
    Classes as BlueprintClasses,
    Tooltip as BlueprintTooltip,
    TooltipProps as BlueprintTooltipProps,
    Utils as BlueprintUtils,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { Markdown, MarkdownProps } from "./../../cmem/markdown/Markdown";

export interface TooltipProps extends Omit<BlueprintTooltipProps, "position"> {
    /**
     * Add dotted underline as visual indication to the target that a tooltip is attached.
     * Should be used together with text-only elements.
     */
    addIndicator?: boolean;
    /**
     * The size specifies the dimension the tooltip overlay element can maximal grow.
     */
    size?: "small" | "medium" | "large";
    /**
     * The tooltip will be attached to this element when it is hovered.
     */
    children: React.ReactNode | React.ReactNode[];
    /**
     * A regular expression that when it matches against the tooltip text, enables the tooltip to be rendered as Markdown.
     * This only works if the tooltip content is a string.
     * Set to `false` to turn off Markdown rendering completely.
     */
    markdownEnabler?: false | string;
    /**
     * Set properties for the Markdown parser
     */
    markdownProps?: Omit<MarkdownProps, "children">;
    /**
     * Use the overlay target as placeholder before the real `<Tooltip /` is rendered on first hover or focus event.
     * This can boost performance massive but it is currently experimental.
     * Placeholders are never used when `disabled`, `defaultIsOpen` or `isOpen` is set to `true`, or if `renderTarget` is set.
     * If the tooltip `content` is only a string then a placeholder is automatically used, too.
     * You can prevent it in any case by setting it to `false`.
     */
    usePlaceholder?: boolean;
}

export const Tooltip = ({
    children,
    content,
    className = "",
    size = "medium",
    addIndicator = false,
    markdownEnabler = "\n\n",
    markdownProps,
    usePlaceholder,
    ...otherTooltipProps
}: TooltipProps) => {
    const placeholderRef = React.useRef(null);
    const eventmemory = React.useRef<null | "afterhover" | "afterfocus">(null);
    const searchId = React.useRef<null | string>(null);
    const [placeholder, setPlaceholder] = React.useState<boolean>(
        (!otherTooltipProps?.disabled ||
            !!otherTooltipProps?.defaultIsOpen ||
            !!otherTooltipProps?.isOpen ||
            !otherTooltipProps?.renderTarget) &&
            (usePlaceholder === true || (typeof content === "string" && usePlaceholder !== false))
    );

    const targetClassName =
        `${eccgui}-tooltip__wrapper` +
        (className ? " " + className : "") +
        (addIndicator === true ? " " + BlueprintClasses.TOOLTIP_INDICATOR : "");
    React.useEffect(() => {
        if (placeholderRef.current) {
            const swap = (ev: MouseEvent | globalThis.FocusEvent) => {
                eventmemory.current = ev.type === "focusin" ? "afterfocus" : "afterhover";
                searchId.current = Date.now().toString(16) + Math.random().toString(16).slice(2);
                setPlaceholder(false);
            };
            (placeholderRef.current as HTMLElement).addEventListener("mouseenter", swap);
            (placeholderRef.current as HTMLElement).addEventListener("focusin", swap);
        }
    }, [!!placeholderRef.current]);

    const refocus = React.useCallback((node) => {
        if (eventmemory.current && node) {
            // we do not have a `targetRef` here, so we need to workaround it
            // const target = node.targetRef.current.children[0];
            const target = document.body.querySelector(
                `[data-postplaceholder=id${eventmemory.current}${searchId.current}]`
            )?.children[0];
            if (target) {
                switch (eventmemory.current) {
                    case "afterfocus":
                        (target as HTMLElement).focus();
                        break;
                    case "afterhover":
                        (target as HTMLElement).dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
                        break;
                }
            }
        }
    }, []);

    const displayPlaceholder = () => {
        const PlaceholderElement = otherTooltipProps?.targetTagName ?? (otherTooltipProps?.fill ? "div" : "span");
        const childTarget = BlueprintUtils.ensureElement(React.Children.toArray(children)[0]);
        if (!childTarget) {
            return null;
        }
        return React.createElement(
            PlaceholderElement,
            {
                ...otherTooltipProps?.targetProps,
                className: `${BlueprintClasses.POPOVER_TARGET} ${targetClassName}`,
                ref: placeholderRef,
            },
            React.cloneElement(childTarget, {
                ...childTarget.props,
                className:
                    childTarget.props.className ?? "" + (otherTooltipProps.fill ? ` ${BlueprintClasses.FILL}` : ""),
                tabIndex: 0,
            })
        );
    };

    let tooltipContent = content;

    if (
        typeof content === "string" &&
        typeof markdownEnabler === "string" &&
        new RegExp(markdownEnabler).test(content)
    ) {
        tooltipContent = <Markdown {...markdownProps}>{content}</Markdown>;
    }

    return placeholder ? (
        displayPlaceholder()
    ) : (
        <BlueprintTooltip
            lazy={true}
            hoverOpenDelay={500}
            {...otherTooltipProps}
            content={tooltipContent}
            className={targetClassName}
            popoverClassName={
                `${eccgui}-tooltip__content` +
                ` ${eccgui}-tooltip--${size}` +
                (className ? " " + className + "__content" : "")
            }
            ref={refocus}
            targetProps={
                {
                    ...otherTooltipProps.targetProps,
                    "data-postplaceholder": `id${eventmemory.current}${searchId.current}`,
                } as React.HTMLProps<HTMLElement>
            }
        >
            {children}
        </BlueprintTooltip>
    );
};

export default Tooltip;
