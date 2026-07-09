import React, { memo } from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { Label } from "../Label/Label";

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Public prop contract for {@link Switch}.
 *
 * Structurally identical to the historical `Omit<BlueprintSwitchProps, "onChange">`
 * (Blueprint `ControlProps` + `innerLabel`/`innerLabelChecked`) with the custom
 * boolean `onChange` on top. The `onChange` signature is intentionally NOT the
 * native change event — it stays `(value: boolean) => void`, exactly as before.
 */
export interface SwitchProps extends Omit<HTMLInputProps, "size" | "onChange"> {
    /**
     * Event handler for changed state.
     */
    onChange?: (value: boolean) => void;
    /**
     * class names
     */
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
    /** Name of the HTML tag that wraps the switch. */
    tagName?: keyof React.JSX.IntrinsicElements;
    /**
     * Text to display inside the switch indicator when checked.
     * If `innerLabel` is provided and this prop is omitted, then `innerLabel`
     * will be used for both states.
     */
    innerLabelChecked?: string;
    /**
     * Text to display inside the switch indicator when unchecked.
     */
    innerLabel?: string;
}

export const Switch = ({
    onChange,
    className,
    label,
    labelElement,
    children,
    disabled,
    inline,
    inputRef,
    style,
    tagName = "label",
    alignIndicator,
    large,
    size,
    innerLabel,
    innerLabelChecked,
    ...inputProps
}: SwitchProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(!!e.target?.checked);
        }
    };

    // preserve historical behaviour: a `label` string is rendered through the shared Label component
    const resolvedLabelElement =
        labelElement ?? (label ? <Label text={label} isLayoutForElement="span" inline /> : undefined);

    const hasInnerLabels = innerLabel != null || innerLabelChecked != null;
    const large_ = large || size === "large";
    const alignRight = alignIndicator === "right" || alignIndicator === "end";
    // track/thumb/inner-label dimensions kept in sync between the three slots
    const trackSize = large_ ? "h-6 w-11" : "h-[1.15rem] w-8";
    const thumbSize = large_ ? "before:size-5" : "before:size-4";

    return React.createElement(
        tagName,
        {
            className: cn(
                `${eccgui}-switch`,
                inline ? "inline-flex" : "flex",
                "relative max-w-full cursor-pointer items-center gap-2 align-middle",
                alignRight && "flex-row-reverse justify-between",
                disabled && "cursor-not-allowed",
                className || undefined
            ),
            style,
        },
        <input
            {...inputProps}
            ref={inputRef}
            type="checkbox"
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only"
        />,
        <span
            key="track"
            aria-hidden
            className={cn(
                "relative inline-block shrink-0 rounded-full border border-transparent bg-input align-middle shadow-inner transition-colors",
                trackSize,
                // thumb rendered as a pseudo element so it can be moved via `peer-checked:` on this (sibling) span
                "before:absolute before:top-1/2 before:left-[2px] before:-translate-y-1/2 before:translate-x-0 before:rounded-full before:bg-card before:shadow before:transition-transform before:content-['']",
                thumbSize,
                "peer-checked:bg-primary peer-checked:before:translate-x-[calc(100%-2px)]",
                "peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
                "peer-disabled:opacity-50"
            )}
        />,
        hasInnerLabels ? (
            <span
                key="inner-off"
                aria-hidden
                className={cn(
                    "pointer-events-none absolute top-1/2 left-0 flex -translate-y-1/2 items-center justify-center text-[9px] font-medium text-foreground uppercase opacity-100 peer-checked:opacity-0",
                    trackSize
                )}
            >
                {innerLabel}
            </span>
        ) : null,
        hasInnerLabels ? (
            <span
                key="inner-on"
                aria-hidden
                className={cn(
                    "pointer-events-none absolute top-1/2 left-0 flex -translate-y-1/2 items-center justify-center text-[9px] font-medium text-primary-foreground uppercase opacity-0 peer-checked:opacity-100",
                    trackSize
                )}
            >
                {innerLabelChecked ?? innerLabel}
            </span>
        ) : null,
        resolvedLabelElement != null || children != null ? (
            // Dim all label content (string label, labelElement, children) uniformly here,
            // mirroring Checkbox/RadioButton; the inner `Label` must not self-dim on top.
            <span key="label" className={cn("min-w-0", disabled && "opacity-50")}>
                {resolvedLabelElement}
                {children}
            </span>
        ) : null
    );
};

export default memo(Switch);
