import React from "react";
import { cva } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { IntentTypes } from "@/common/Intent";
import { cn } from "@/common/utils/cn";
import Badge, { BadgeProps } from "@/components/atoms/Badge/Badge";
import { ValidIconName } from "@/components/atoms/Icon/canonicalIconNames";
import Icon from "@/components/atoms/Icon/Icon";
import Tooltip, { TooltipProps } from "@/components/atoms/Tooltip/Tooltip";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

/**
 * Local two-axis button recipe (shadcn foundations, BlueprintJS-free).
 *
 * The `variant` axis controls the fill mode (solid | outline | ghost | link) and the
 * `intent` axis the semantic color; the two combine through `compoundVariants`. The base
 * layout string and the `size` axis mirror the vendored shadcn recipe
 * (`src/_shadcn/ui/button.tsx`) — now including its icon-only boxes, whose heights match the
 * text-button heights (`size-9`/`size-8`/`size-10` ↔ `h-9`/`h-8`/`h-10`) — minus only its
 * forced `svg` sizing, because the gui-elements `Icon` owns its own dimensions
 * (`small`/`large`).
 *
 * Exported so other Tailwind-based recipes in the library can reuse it.
 */
export const buttonVariants = cva(
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                solid: "",
                outline: "border",
                ghost: "",
                link: "underline-offset-4 hover:underline",
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
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        compoundVariants: [
            // solid: filled background, contrasting foreground
            {
                variant: "solid",
                intent: ["none", "neutral"],
                class: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            },
            {
                variant: "solid",
                intent: ["primary", "accent"],
                class: "bg-primary text-primary-foreground hover:bg-primary/90",
            },
            { variant: "solid", intent: "info", class: "bg-info text-info-foreground hover:bg-info/90" },
            { variant: "solid", intent: "success", class: "bg-success text-success-foreground hover:bg-success/90" },
            { variant: "solid", intent: "warning", class: "bg-warning text-warning-foreground hover:bg-warning/90" },
            { variant: "solid", intent: "danger", class: "bg-destructive text-white hover:bg-destructive/90" },
            // outline: colored border + text, transparent fill, subtle hover tint
            {
                variant: "outline",
                intent: ["none", "neutral"],
                class: "border-input bg-card text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground",
            },
            {
                variant: "outline",
                intent: ["primary", "accent"],
                class: "border-primary text-primary hover:bg-primary/10",
            },
            { variant: "outline", intent: "info", class: "border-info text-info hover:bg-info/10" },
            { variant: "outline", intent: "success", class: "border-success text-success hover:bg-success/10" },
            { variant: "outline", intent: "warning", class: "border-warning text-warning hover:bg-warning/10" },
            {
                variant: "outline",
                intent: "danger",
                class: "border-destructive text-destructive hover:bg-destructive/10",
            },
            // ghost: no border/fill, colored text, subtle hover tint
            {
                variant: "ghost",
                intent: ["none", "neutral"],
                class: "text-foreground hover:bg-accent hover:text-accent-foreground",
            },
            { variant: "ghost", intent: ["primary", "accent"], class: "text-primary hover:bg-primary/10" },
            { variant: "ghost", intent: "info", class: "text-info hover:bg-info/10" },
            { variant: "ghost", intent: "success", class: "text-success hover:bg-success/10" },
            { variant: "ghost", intent: "warning", class: "text-warning hover:bg-warning/10" },
            { variant: "ghost", intent: "danger", class: "text-destructive hover:bg-destructive/10" },
            // link: colored text only
            { variant: "link", intent: ["none", "neutral"], class: "text-foreground" },
            { variant: "link", intent: ["primary", "accent"], class: "text-primary" },
            { variant: "link", intent: "info", class: "text-info" },
            { variant: "link", intent: "success", class: "text-success" },
            { variant: "link", intent: "warning", class: "text-warning" },
            { variant: "link", intent: "danger", class: "text-destructive" },
        ],
        defaultVariants: {
            variant: "solid",
            intent: "none",
            size: "default",
        },
    },
);

/**
 * Button size, mirroring the historical values understood by the component.
 */
export type ButtonSize = "small" | "medium" | "large";

interface AdditionalButtonProps extends TestableComponent {
    /**
     * Always use this when the button triggers an affirmative action, e.g. confirm a process.
     * The button is displayed with accent color intent.
     */
    affirmative?: boolean;
    /**
     * Always use this when the button triggers an disruptive action, e.g. delete or remove.
     * The button is displayed with danger color intent.
     */
    disruptive?: boolean;
    /**
     * Use this when a button is important enough to highlight it in a set of other buttons.
     * The button is displayed with accent color intent.
     */
    elevated?: boolean;
    /**
     * Intent state visualized by color.
     */
    intent?: IntentTypes;
    /**
     * Content displayed in a badge that is attached to the button.
     * By default it is displayed `{ size: "small", position: "top-right", maxLength: 2 }` and with the same intent state of the button.
     * Use `badgeProps` to change that default behaviour.
     */
    badge?: BadgeProps["children"];
    /**
     * Object with additional properties for the badge.
     */
    badgeProps?: Partial<Omit<BadgeProps, "children">>;
    /**
     * takes in either a string of text or a react element to display as a tooltip when the button is hovered.
     */
    tooltip?: string | React.JSX.Element | null;
    /**
     * Object with additional properties for the tooltip.
     */
    tooltipProps?: Partial<Omit<TooltipProps, "content" | "children">>;
    /**
     * Icon displayed on button start.
     */
    icon?: ValidIconName | React.JSX.Element;
    /**
     * Icon displayed on button end.
     */
    rightIcon?: ValidIconName | React.JSX.Element;
    /**
     * Button label. It is rendered before `children`.
     */
    text?: React.ReactNode;
    /**
     * A space-delimited list of class names to pass to the label (`span`) element.
     */
    textClassName?: string;
    /**
     * Size of the button.
     */
    size?: ButtonSize;
    /**
     * Fill mode of the button.
     *
     * `"solid" | "outline" | "ghost" | "link"` are the canonical values. The two legacy values
     * `"outlined"` and `"minimal"` (BlueprintJS-6) are accepted as deprecated aliases mapping to
     * `"outline"` and `"ghost"` respectively.
     *
     * When set, `variant` takes precedence over the deprecated `minimal`/`outlined` booleans.
     */
    variant?: "solid" | "outline" | "ghost" | "link" | "outlined" | "minimal";
    /**
     * Display a loading spinner and disable the button while it is active.
     */
    loading?: boolean;
    /**
     * Display the button in an active (pressed / selected) state.
     */
    active?: boolean;
    /**
     * Let the button span the full width of its container.
     */
    fill?: boolean;
    /**
     * Horizontal alignment of the button content.
     */
    alignText?: "left" | "center" | "right" | "start" | "end";
    /**
     * Truncate the button label with an ellipsis when it overflows.
     */
    ellipsizeText?: boolean;
    /**
     * Display the button without background or border.
     * @deprecated Alias for the `ghost` variant kept for backwards compatibility.
     */
    minimal?: boolean;
    /**
     * Display the button with a border and a transparent background.
     * @deprecated Alias for the `outline` variant kept for backwards compatibility.
     */
    outlined?: boolean;
    /**
     * Display a smaller button.
     * @deprecated Use `size="small"` instead.
     */
    small?: boolean;
    /**
     * Display a larger button.
     * @deprecated Use `size="large"` instead.
     */
    large?: boolean;
}

export type ButtonProps = AdditionalButtonProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Internal implementation of {@link Button}. Wrapped in `React.forwardRef` below so the ref reaches
 * the rendered `<button>`/`<a>` element.
 */
const ButtonInner = (
    {
        children,
        className = "",
        affirmative = false,
        disruptive = false,
        elevated = false,
        icon,
        rightIcon,
        tooltip = null,
        tooltipProps,
        badge,
        badgeProps = { size: "small", position: "top-right", maxLength: 2 },
        intent,
        text,
        textClassName,
        size,
        loading = false,
        active = false,
        fill = false,
        alignText,
        ellipsizeText = false,
        variant,
        minimal,
        outlined,
        small,
        large,
        disabled,
        type,
        href,
        tabIndex,
        ...restProps
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) => {
    // Explicit `intent` wins; otherwise derive it from the semantic flags (kept identical to the
    // historical behaviour: affirmative/elevated -> accent, disruptive -> danger).
    let semanticIntent: IntentTypes | undefined = intent;
    if (!semanticIntent) {
        if (affirmative || elevated) {
            semanticIntent = "accent";
        } else if (disruptive) {
            semanticIntent = "danger";
        }
    }
    const cvaIntent = semanticIntent ?? "none";

    // Precedence: an explicit `variant` prop wins (mapping the deprecated BlueprintJS-6 aliases
    // `outlined` -> `outline` and `minimal` -> `ghost`), then the deprecated `outlined`/`minimal`
    // booleans (kept mapping identically to the historical behaviour), then the default `solid`.
    const resolvedVariant: "solid" | "outline" | "ghost" | "link" = variant
        ? variant === "outlined"
            ? "outline"
            : variant === "minimal"
              ? "ghost"
              : variant
        : outlined
          ? "outline"
          : minimal
            ? "ghost"
            : "solid";

    const buttonSizing: ButtonSize =
        large || size === "large" ? "large" : small || size === "small" ? "small" : "medium";
    // Medium and small buttons render 16px (`small`) icons, large buttons the 20px default
    // (never the 32px `large` glyph — oversized for any button box). Previously medium also
    // rendered the 20px default, which dominated the icon-only box.
    const iconSizeProps = { small: buttonSizing !== "large", large: false };

    const renderedIcon = typeof icon === "string" ? <Icon name={icon} {...iconSizeProps} /> : icon;
    const renderedRightIcon = typeof rightIcon === "string" ? <Icon name={rightIcon} {...iconSizeProps} /> : rightIcon;

    const hasLabel = text != null || children != null;
    const isIconOnly = !hasLabel && (renderedIcon != null || renderedRightIcon != null);

    const cvaSize =
        buttonSizing === "large"
            ? isIconOnly
                ? "icon-lg"
                : "lg"
            : buttonSizing === "small"
              ? isIconOnly
                  ? "icon-sm"
                  : "sm"
              : isIconOnly
                ? "icon"
                : "default";

    const alignClassName =
        alignText === "left" || alignText === "start"
            ? "justify-start text-left"
            : alignText === "right" || alignText === "end"
              ? "justify-end text-right"
              : alignText === "center"
                ? "justify-center text-center"
                : undefined;

    // Approximate the historical pressed/selected state: darken solids, fill non-solids.
    const activeClassName = active
        ? resolvedVariant === "solid"
            ? "brightness-95"
            : "bg-accent text-accent-foreground"
        : undefined;

    const computedClassName = cn(
        buttonVariants({ variant: resolvedVariant, intent: cvaIntent, size: cvaSize }),
        fill && "w-full",
        alignClassName,
        activeClassName,
        // While loading keep the button crisp (no dim), block interaction and hide the content but
        // preserve its footprint; the spinner (marked by `animate-spin`) stays visible.
        loading && "cursor-default disabled:opacity-100 aria-disabled:opacity-100 [&>*:not(.animate-spin)]:invisible",
        `${eccgui}-button`,
        className,
    );

    const isDisabled = Boolean(disabled) || loading;

    const content = (
        <>
            {loading && (
                <LoaderCircle
                    aria-hidden="true"
                    className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin",
                        buttonSizing === "large" ? "size-5" : "size-4",
                    )}
                />
            )}
            {renderedIcon}
            {hasLabel && (
                <span className={cn("min-w-0", ellipsizeText && "truncate", textClassName)}>
                    {text}
                    {children}
                </span>
            )}
            {renderedRightIcon}
            {typeof badge !== "undefined" && (
                <Badge
                    children={badge}
                    {...constructBadgeProperties({
                        intent,
                        // Keep the badge appearance consistent whether the fill mode was chosen via
                        // the deprecated `minimal`/`outlined` booleans or the `variant` prop.
                        minimal: resolvedVariant === "ghost",
                        outlined: resolvedVariant === "outline",
                        badgeProps,
                    })}
                />
            )}
        </>
    );

    const button =
        href != null ? (
            <a
                {...restProps}
                ref={ref as React.Ref<HTMLAnchorElement>}
                href={isDisabled ? undefined : href}
                tabIndex={isDisabled ? -1 : tabIndex}
                aria-disabled={isDisabled || undefined}
                aria-busy={loading || undefined}
                data-active={active ? "true" : undefined}
                role="button"
                className={computedClassName}
            >
                {content}
            </a>
        ) : (
            <button
                {...restProps}
                ref={ref as React.Ref<HTMLButtonElement>}
                type={type ?? "button"}
                disabled={isDisabled}
                tabIndex={tabIndex}
                aria-busy={loading || undefined}
                data-active={active ? "true" : undefined}
                className={computedClassName}
            >
                {content}
            </button>
        );

    return tooltip && !loading ? (
        <Tooltip content={tooltip} {...tooltipProps}>
            <span>{button}</span>
        </Tooltip>
    ) : (
        button
    );
};

/**
 * Display a button element to enable user interaction.
 * It normally should trigger action when clicked.
 *
 * The `ref` is forwarded to the rendered `<button>` (or `<a>` when `href` is set). This is required
 * so the button can be used as the child of a Radix `asChild` trigger (e.g. the default toggler of
 * `ContextMenu`), which needs a ref to anchor its popover.
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(ButtonInner);
Button.displayName = "Button";

interface ConstructBadgePropertiesProps {
    intent?: IntentTypes;
    minimal?: boolean;
    outlined?: boolean;
    badgeProps?: Partial<Omit<BadgeProps, "children">>;
}

const constructBadgeProperties = ({ intent, minimal, outlined, badgeProps = {} }: ConstructBadgePropertiesProps) => {
    if (badgeProps.intent) return badgeProps;
    if (intent) badgeProps["intent"] = intent;
    if (!badgeProps.tagProps || typeof badgeProps.tagProps.minimal === "undefined") {
        if (!minimal && !outlined) {
            badgeProps["tagProps"] = { ...badgeProps.tagProps, minimal: true };
        }
    }
    return badgeProps;
};

export default Button;
