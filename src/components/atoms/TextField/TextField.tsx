import React from "react";

import { Definitions as IntentDefinitions, IntentTypes } from "@/common/Intent";
import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { Input } from "@/_shadcn/ui/input";
import { ValidIconName } from "@/components/atoms/Icon/canonicalIconNames";
import Icon from "@/components/atoms/Icon/Icon";

import { InvisibleCharacterWarningProps, useTextValidation } from "./useTextValidation";

/**
 * Blueprint-free replacement for Blueprint's `MaybeElement`
 * (`JSX.Element | false | null | undefined`). Kept structurally identical so the
 * public `leftIcon`/`rightElement` prop surface stays frozen.
 */
type MaybeElement = React.JSX.Element | false | null | undefined;

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /**
     * Controlled value. Narrowed to `string` (matching the historical Blueprint
     * `ControlledProps` surface) so consumers such as `SearchField` keep compiling.
     */
    value?: string;
    /**
     * Uncontrolled default value. Narrowed to `string` for the same reason as `value`.
     */
    defaultValue?: string;
    /**
     * Intent state of the text field.
     */
    intent?: IntentTypes | "edited" | "removed";
    /**
     * The input element uses the full horizontal width of the parent container.
     */
    fullWidth?: boolean;
    /**
     * Blueprint alias of `fullWidth`. When set it takes precedence over `fullWidth`
     * (mirrors the historical behaviour where a directly passed `fill` overrode the
     * `fullWidth`-derived default).
     */
    fill?: boolean;
    /**
     * Left aligned icon, can be a canonical icon name or an `Icon` element.
     */
    leftIcon?: ValidIconName | MaybeElement;
    /**
     * Element rendered on the right hand side of the input (e.g. an action button).
     */
    rightElement?: MaybeElement;
    /**
     * Render the input with fully rounded corners.
     */
    round?: boolean;
    /**
     * Render the small size variant.
     */
    small?: boolean;
    /**
     * Render the large size variant.
     */
    large?: boolean;
    /**
     * Ref to the underlying `<input>` element. Accepts a callback or object ref.
     */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * If set, allows to be informed of invisible, hard to spot characters in the string value.
     */
    invisibleCharacterWarning?: InvisibleCharacterWarningProps;

    /** If true pressing the Escape key will blur/de-focus the input field. Default: false */
    escapeToBlur?: boolean;

    /**
     * Pass-through for arbitrary `data-*` attributes (e.g. `data-test-id`, `data-id`).
     * Preserves the historical permissiveness of the Blueprint-based prop surface without
     * re-introducing a Blueprint dependency.
     */
    [dataAttribute: `data-${string}`]: unknown;
}

/** Assigns a ref (callback or object) without depending on Blueprint's ref plumbing. */
const assignRef = <T,>(ref: React.Ref<T> | undefined, value: T | null): void => {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
    }
};

/**
 * Intent -> input border/ring utilities (ported from the former `textfield.scss`
 * `$eccgui-map-textfield-intent-tokens` + `textfield-intent-colors` mixin — SCSS sunset).
 *
 * The base `Input` recipe already carries `focus-visible:ring-[3px]`, so each entry only needs
 * to swap the border and ring *color* (via `cn()`/tailwind-merge, last one wins over the recipe's
 * `border-input` / `focus-visible:border-ring` / `focus-visible:ring-ring/50`). `edited`/`removed`
 * additionally tint the value text / strike it through. Full static strings (no `${}` interpolation)
 * so the Tailwind extractor can see every class. Keyed by the same intents the wrapper's
 * `eccgui-intent--X` class is emitted for; `none` intentionally maps to nothing (neutral default).
 */
export const textFieldIntentClassName: Partial<Record<NonNullable<TextFieldProps["intent"]>, string>> = {
    primary: "border-primary focus-visible:border-primary focus-visible:ring-primary/50",
    accent: "border-primary focus-visible:border-primary focus-visible:ring-primary/50",
    success: "border-success focus-visible:border-success focus-visible:ring-success/50",
    warning: "border-warning focus-visible:border-warning focus-visible:ring-warning/50",
    danger: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50",
    info: "border-info focus-visible:border-info focus-visible:ring-info/50",
    neutral: "border-foreground focus-visible:border-foreground focus-visible:ring-foreground/50",
    edited: "border-info focus-visible:border-info focus-visible:ring-info/50 text-info",
    removed:
        "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50 line-through decoration-destructive decoration-2",
};

/**
 * Text input field.
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>((props, forwardedRef) => {
    const {
        className = "",
        fullWidth = true,
        fill,
        leftIcon,
        rightElement,
        invisibleCharacterWarning,
        escapeToBlur = false,
        intent,
        inputRef,
        round,
        small,
        large,
        onChange,
        onKeyDown,
        title,
        ...rest
    } = props;

    // Internal ref keeps `escapeToBlur` working regardless of whether a consumer also
    // supplies `inputRef` or the forwarded `ref` – all three point at the same input node.
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = React.useCallback(
        (node: HTMLInputElement | null) => {
            innerRef.current = node;
            assignRef(forwardedRef, node);
            assignRef(inputRef, node);
        },
        [forwardedRef, inputRef],
    );

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = React.useCallback(
        (event) => {
            if (escapeToBlur && event.key === "Escape") {
                event.preventDefault();
                innerRef.current?.blur();
                return false;
            }
            return onKeyDown?.(event);
        },
        [onKeyDown, escapeToBlur],
    );

    let iconIntent: IntentTypes | undefined;
    switch (intent) {
        case "edited":
            iconIntent = IntentDefinitions.INFO;
            break;
        case "removed":
            iconIntent = IntentDefinitions.DANGER;
            break;
        default:
            iconIntent = intent as IntentTypes | undefined;
            break;
    }

    const maybeWrappedOnChange = useTextValidation<HTMLInputElement>({
        value: props.value,
        onChange,
        invisibleCharacterWarning,
    });

    // Show the value as a native tooltip for read-only/disabled fields that have no explicit title.
    const computedTitle =
        (props.readOnly || props.disabled) && props.value != null && props.value !== "" && !title
            ? String(props.value)
            : title;

    // `fill` (when provided) wins over the `fullWidth`-derived default, matching legacy behaviour.
    const isFill = fill !== undefined ? fill : fullWidth;

    const hasLeftIcon = leftIcon != null && leftIcon !== false;

    return (
        <div
            className={cn(
                `${eccgui}-textfield`,
                // Intent classes stay on the wrapper (byte-identical to the legacy output –
                // `intentClassName()` is not used because it rejects "edited"/"removed").
                intent && `${eccgui}-intent--${intent}`,
                "relative items-center",
                isFill ? "flex w-full" : "inline-flex",
                className,
            )}
        >
            {hasLeftIcon && (
                <span
                    className={cn(
                        `${eccgui}-textfield__leftcontainer`,
                        "absolute inset-y-0 left-2.5 z-10 flex items-center text-muted-foreground",
                    )}
                >
                    {typeof leftIcon === "string" ? (
                        <Icon name={leftIcon as ValidIconName} intent={iconIntent} small />
                    ) : (
                        leftIcon
                    )}
                </span>
            )}
            <Input
                ref={setRefs}
                className={cn(
                    `${eccgui}-textfield__input`,
                    !isFill && "w-auto",
                    hasLeftIcon && "pl-8",
                    rightElement && "pr-9",
                    round && "rounded-full",
                    small && "h-8",
                    large && "h-10",
                    // Intent border/ring colors live on the input element (the wrapper keeps the
                    // frozen `eccgui-intent--X` class above for external selectors).
                    intent && textFieldIntentClassName[intent],
                )}
                {...rest}
                title={computedTitle}
                dir={"auto"}
                onChange={maybeWrappedOnChange}
                onKeyDown={onKeyDown || escapeToBlur ? handleKeyDown : undefined}
            />
            {rightElement && (
                <span
                    className={cn(
                        `${eccgui}-textfield__action`,
                        "absolute inset-y-0 right-1.5 z-10 flex items-center gap-1",
                    )}
                >
                    {rightElement}
                </span>
            )}
        </div>
    );
});

TextField.displayName = "TextField";

export default TextField;
