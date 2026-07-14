import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Public prop contract for {@link RadioButton}.
 *
 * Kept structurally identical to the historical Blueprint `RadioProps`
 * (`ControlProps`) plus `hideIndicator`, so the public API stays frozen. In
 * particular `onChange` remains a native `React.ChangeEventHandler<HTMLInputElement>` —
 * consumers rely on reading `e.target.value` / `e.target.checked`.
 */
export interface RadioButtonProps extends Omit<HTMLInputProps, "size"> {
    /** A space-delimited list of class names to pass along to the wrapping element. */
    className?: string;
    /** Alignment of the indicator within container. */
    alignIndicator?: "center" | "end" | "left" | "right" | "start";
    /** JSX label for the control. */
    children?: React.ReactNode;
    /** Whether the control is non-interactive. */
    disabled?: boolean;
    /** Whether the control should appear as an inline element. */
    inline?: boolean;
    /** Ref attached to the HTML `<input>` element backing this component. */
    inputRef?: React.Ref<HTMLInputElement>;
    /** Text label for the control. */
    label?: string;
    /** JSX element label for the control. */
    labelElement?: React.ReactNode;
    /**
     * Whether this control should use large styles.
     *
     * @deprecated use `size="large"` instead
     */
    large?: boolean;
    /** Size of the control. */
    size?: "medium" | "large";
    /** Name of the HTML tag that wraps the radio button. */
    tagName?: keyof React.JSX.IntrinsicElements;
    /**
     * Hide the indicator.
     * The element cannot be identified as radio input then but a click on the children can be easily processed via `onChange` event.
     */
    hideIndicator?: boolean;
}

export const RadioButton = ({
    alignIndicator,
    children,
    className = "",
    disabled,
    inline,
    inputRef,
    label,
    labelElement,
    large,
    size,
    style,
    tagName = "label",
    hideIndicator = false,
    ...inputProps
}: RadioButtonProps) => {
    const large_ = large || size === "large";
    const alignRight = alignIndicator === "right" || alignIndicator === "end";
    const hasLabelContent = label != null || labelElement != null || children != null;

    return React.createElement(
        tagName,
        {
            className: cn(
                `${eccgui}-radiobutton`,
                { [`${eccgui}-radiobutton--hidden-indicator`]: hideIndicator },
                // Blueprint controls default to block-level (stacked); `inline` makes them inline
                inline ? "inline-flex" : "flex",
                "relative max-w-full cursor-pointer items-center gap-2 align-top",
                alignRight && "flex-row-reverse justify-between",
                disabled && "cursor-not-allowed",
                className || undefined
            ),
            style,
        },
        <input
            {...inputProps}
            ref={inputRef}
            type="radio"
            disabled={disabled}
            className="peer sr-only"
        />,
        hideIndicator ? null : (
            <span
                key="indicator"
                aria-hidden
                className={cn(
                    // the dot inside uses `currentColor`; keep it transparent until checked so it stays hidden
                    "grid shrink-0 place-content-center rounded-full border border-input bg-card text-transparent shadow-xs transition-colors",
                    large_ ? "size-5" : "size-4",
                    "peer-checked:border-primary peer-checked:text-primary",
                    "peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
                    "peer-disabled:opacity-50"
                )}
            >
                <span className={cn("rounded-full bg-current", large_ ? "size-2.5" : "size-2")} />
            </span>
        ),
        hasLabelContent ? (
            <span key="label" className={cn("min-w-0", disabled && "opacity-50")}>
                {label}
                {labelElement}
                {children}
            </span>
        ) : null
    );
};

export default RadioButton;
