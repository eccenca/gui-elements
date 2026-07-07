import React from "react";
import { cva } from "class-variance-authority";
import Color, { ColorLike } from "color";

import { intentClassName, IntentTypes } from "../../common/Intent";
import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ValidIconName } from "../Icon/canonicalIconNames";
import Icon, { IconProps } from "../Icon/Icon";
import { TestIconProps } from "../Icon/TestIcon";

import decideContrastColorValue from "./../../common/utils/colorDecideContrastvalue";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    // own properties

    /**
     * Sets the background color of a tag, depends on the `Color` object provided by the
     * [npm color module](https://www.npmjs.com/export package/color) v3. You can use it with
     * all allowed [CSS color values](https://developer.mozilla.org/de/docs/Web/CSS/color_value).
     *
     * The front color is set automatically, so the tag label is always readable.
     */
    backgroundColor?: ColorLike;

    /**
     * visual appearance and "thickness" of the tag
     */
    emphasis?: "stronger" | "strong" | "normal" | "weak" | "weaker";
    /**
     * display tag in a small version
     */
    small?: boolean;
    /**
     * display tag in a large version
     */
    large?: boolean;
    /**
     * Meaning of the tag.
     */
    intent?: IntentTypes;
    /**
     * Icon displayed left from the tag label.
     */
    icon?: ValidIconName | React.ReactElement<IconProps> | React.ReactElement<TestIconProps>;
    /**
     * Whether this tag should use minimal styles.
     *
     * @default true
     */
    minimal?: boolean;
    /**
     * Whether this tag should have rounded ends.
     *
     * @default false
     */
    round?: boolean;
    /**
     * Whether the tag should visually respond to user interactions. If set to `true`, hovering over the
     * tag will change its cursor and it becomes keyboard focusable.
     *
     * Tags will be marked as interactive automatically if an `onClick` handler is provided and this prop is not set.
     */
    interactive?: boolean;
    /**
     * HTML title to be passed to the tag label.
     */
    htmlTitle?: string;
    /**
     * Click handler for the remove button.
     * The remove button will only be rendered if this prop is defined.
     */
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>, tagProps: TagProps) => void;
}

/**
 * Class recipe for the tag element.
 *
 * The base reuses the structural utility vocabulary of the vendored shadcn/ui `badge`
 * recipe (`src/_shadcn/ui/badge.tsx`, `badgeVariants`); the sizing, rounding, emphasis and
 * intent colouring are expressed as local axes so the frozen `Tag` API keeps driving them.
 */
const tagVariants = cva(
    "inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-transparent align-middle font-medium whitespace-nowrap transition-[color,background-color] focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]",
    {
        variants: {
            size: {
                small: "h-4 min-h-4 px-1.5 text-[0.6875rem] leading-none",
                medium: "h-5 min-h-5 px-2 text-xs leading-none",
                large: "h-6 min-h-6 px-2.5 text-sm leading-none",
            },
            round: {
                true: "rounded-full",
                false: "",
            },
            interactive: {
                true: "cursor-pointer",
                false: "cursor-default",
            },
            minimal: {
                true: "",
                false: "",
            },
            emphasis: {
                stronger: "font-semibold",
                strong: "font-medium",
                normal: "font-medium",
                weak: "font-normal",
                weaker: "font-normal",
            },
            intent: {
                none: "",
                neutral: "",
                primary: "",
                accent: "",
                info: "",
                success: "",
                warning: "",
                danger: "",
            },
        },
        compoundVariants: [
            // --- solid (non-minimal) treatments ------------------------------------
            { minimal: false, intent: ["none", "neutral"], class: "bg-foreground text-background border-transparent" },
            { minimal: false, intent: ["primary", "accent"], class: "bg-primary text-primary-foreground" },
            { minimal: false, intent: "info", class: "bg-info text-info-foreground" },
            { minimal: false, intent: "success", class: "bg-success text-success-foreground" },
            { minimal: false, intent: "warning", class: "bg-warning text-warning-foreground" },
            { minimal: false, intent: "danger", class: "bg-destructive text-white" },
            // --- minimal (soft/tinted) treatments ----------------------------------
            { minimal: true, intent: ["none", "neutral"], class: "bg-secondary text-secondary-foreground border-border" },
            { minimal: true, intent: ["primary", "accent"], class: "bg-primary/10 text-primary border-primary/20" },
            { minimal: true, intent: "info", class: "bg-info/10 text-info border-info/20" },
            { minimal: true, intent: "success", class: "bg-success/10 text-success border-success/20" },
            { minimal: true, intent: "warning", class: "bg-warning/20 text-warning-foreground border-warning/40" },
            { minimal: true, intent: "danger", class: "bg-destructive/10 text-destructive border-destructive/20" },
            // --- emphasis gradient for the neutral minimal tag (the common default) -
            { minimal: true, intent: ["none", "neutral"], emphasis: "stronger", class: "bg-secondary" },
            { minimal: true, intent: ["none", "neutral"], emphasis: "strong", class: "bg-secondary/90" },
            { minimal: true, intent: ["none", "neutral"], emphasis: "normal", class: "bg-secondary/75" },
            { minimal: true, intent: ["none", "neutral"], emphasis: "weak", class: "bg-secondary/60" },
            { minimal: true, intent: ["none", "neutral"], emphasis: "weaker", class: "bg-secondary/45" },
        ],
        defaultVariants: {
            size: "medium",
            round: false,
            interactive: false,
            minimal: true,
            emphasis: "normal",
            intent: "none",
        },
    }
);

/** Mirrors Blueprint's `isReactNodeEmpty`: only `null`/`undefined`/booleans/`""` count as empty (so `0` still renders). */
const isTagContentEmpty = (node: React.ReactNode): boolean =>
    node == null || typeof node === "boolean" || node === "";

function Tag({
    children,
    className = "",
    intent,
    icon,
    emphasis = "normal",
    minimal = true,
    small = false,
    large = false,
    round = false,
    interactive,
    backgroundColor,
    onRemove,
    htmlTitle,
    onClick,
    style,
    title,
    tabIndex,
    ...otherProps
}: TagProps) {
    const isInteractive = interactive ?? !!onClick;

    let tagStyle = style;
    if (backgroundColor) {
        let color = Color("#ffffff");
        try {
            color = Color(backgroundColor);
        } catch {
            // eslint-disable-next-line no-console
            console.warn("Received invalid background color for tag: " + backgroundColor);
        }
        tagStyle = {
            ...(style ?? {}),
            backgroundColor: color.rgb().toString(),
            color: decideContrastColorValue({ testColor: color }),
        };
    }

    const size = small ? "small" : large ? "large" : "medium";
    const leftIcon = !!icon && typeof icon === "string" ? <Icon name={icon} /> : icon;

    // Reassembled props handed back to `onRemove` (mirrors Blueprint's `(e, tagProps) => void`).
    const ownProps: TagProps = {
        children,
        className,
        intent,
        icon,
        emphasis,
        minimal,
        small,
        large,
        round,
        interactive,
        backgroundColor,
        onRemove,
        htmlTitle,
        onClick,
        style,
        title,
        tabIndex,
        ...otherProps,
    };

    return (
        <span
            {...otherProps}
            onClick={onClick}
            role={isInteractive ? "button" : otherProps.role}
            tabIndex={isInteractive ? (tabIndex ?? 0) : tabIndex}
            title={title}
            style={tagStyle}
            className={cn(
                tagVariants({ intent: intent ?? "none", emphasis, size, minimal, interactive: isInteractive, round }),
                // background color is applied inline and must win over the recipe's tint/border
                backgroundColor ? "border-transparent" : "",
                `${eccgui}-tag__item`,
                `${eccgui}-tag--${emphasis}emphasis`,
                intent ? intentClassName(intent) : "",
                small ? `${eccgui}-tag--small` : "",
                large ? `${eccgui}-tag--large` : "",
                className
            )}
        >
            {leftIcon ? React.cloneElement(leftIcon, { small: !large }) : null}
            {!isTagContentEmpty(children) ? (
                <span className={cn(`${eccgui}-tag__text`, "min-w-0 truncate")} title={htmlTitle}>
                    {children}
                </span>
            ) : null}
            {onRemove ? (
                <button
                    aria-label="Remove tag"
                    type="button"
                    className={cn(
                        `${eccgui}-tag__remove`,
                        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent p-0 text-current opacity-70 hover:opacity-100 focus-visible:outline-none"
                    )}
                    tabIndex={0}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(e, ownProps);
                    }}
                >
                    <Icon name="operation-clear" small={!large} />
                </button>
            ) : null}
        </span>
    );
}

export default Tag;
