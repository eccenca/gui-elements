import React from "react";

import { Definitions as IntentDefinitions, IntentTypes } from "../../common/Intent";
import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "../Icon/Icon";
import { ValidIconName } from "../Icon/canonicalIconNames";

import { InvisibleCharacterWarningProps, useTextValidation } from "./useTextValidation";

/**
 * Blueprint-free replacement for Blueprint's `MaybeElement`
 * (`JSX.Element | false | null | undefined`). Kept structurally identical so the
 * public `leftIcon` prop surface stays frozen.
 */
type MaybeElement = React.JSX.Element | false | null | undefined;

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /**
     * Intent state of the text area.
     */
    intent?: IntentTypes | "edited" | "removed";
    /**
     * If set, allows to be informed of invisible, hard to spot characters in the string value.
     */
    invisibleCharacterWarning?: InvisibleCharacterWarningProps;
    /**
     * Left aligned icon, can be a canonical icon name or an `Icon` element.
     * This will update left padding on the text area.
     */
    leftIcon?: ValidIconName | MaybeElement;
    /**
     * Element to render on right side of text area. Should be not too large.
     * This will update right padding on the text area.
     */
    rightElement?: React.JSX.Element;
    /**
     * Add HTML properties to the wrapper element.
     * The element wraps `TextArea` in case of a given `wrapperDivProps`, `leftIcon` or `rightElement` property.
     */
    wrapperDivProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
    /**
     * Whether the text area should automatically grow vertically to accommodate content.
     * @deprecated (v27) use the `autoResize` property instead.
     */
    growVertically?: boolean;
    /**
     * Whether the component should automatically resize vertically as a user types.
     * This disables manual resizing in the vertical dimension.
     */
    autoResize?: boolean;
    /**
     * Ref to the underlying `<textarea>` element. Accepts a callback or object ref.
     */
    inputRef?: React.Ref<HTMLTextAreaElement>;
    /**
     * The text area takes up the full width of its container.
     * @deprecated (Blueprint-inherited) the text area is always rendered full width.
     */
    fill?: boolean;
    /**
     * Render the small size variant.
     * @deprecated (Blueprint-inherited) use `size="small"` instead.
     */
    small?: boolean;
    /**
     * Render the large size variant.
     * @deprecated (Blueprint-inherited) use `size="large"` instead.
     */
    large?: boolean;
    /**
     * The size styling of the text area.
     * @deprecated (Blueprint-inherited) kept for API compatibility.
     */
    size?: "small" | "medium" | "large";
    /**
     * Set this to `true` if you will be controlling the `value` of this input with asynchronous updates.
     * @deprecated (Blueprint-inherited) has no effect on the native `<textarea>`.
     */
    asyncControl?: boolean;

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
 * Multi-line text input field.
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((props, forwardedRef) => {
    const {
        className = "",
        rows = 5,
        invisibleCharacterWarning,
        leftIcon,
        rightElement,
        wrapperDivProps,
        intent,
        inputRef,
        autoResize,
        growVertically,
        onChange,
        ...rest
    } = props;

    // Blueprint-inherited props that have no meaning on a native <textarea>; stripped so React
    // does not warn about unknown DOM attributes. Kept on the public type for API compatibility.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, small, large, size, asyncControl, ...domProps } = rest;

    // Internal ref lets the left icon focus the field regardless of whether a consumer also
    // supplies `inputRef` or the forwarded `ref` – all three point at the same <textarea> node.
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
    const setRefs = React.useCallback(
        (node: HTMLTextAreaElement | null) => {
            innerRef.current = node;
            assignRef(forwardedRef, node);
            assignRef(inputRef, node);
        },
        [forwardedRef, inputRef],
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

    const maybeWrappedOnChange = useTextValidation<HTMLTextAreaElement>({
        value: props.value,
        onChange,
        invisibleCharacterWarning,
    });

    // `growVertically` is the deprecated alias of `autoResize`; both enable content-based sizing.
    const isAutoResize = autoResize || growVertically;
    const hasLeftIcon = leftIcon != null && leftIcon !== false;

    const textarea = (
        <textarea
            ref={setRefs}
            data-slot="textarea"
            className={cn(
                `${eccgui}-textarea`,
                // vendored shadcn textarea recipe (mirrors src/_shadcn/ui/input.tsx)
                "peer flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
                "placeholder:text-muted-foreground",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
                // content-based auto-resize (replaces Blueprint's imperative height syncing)
                isAutoResize && "field-sizing-content resize-none",
                hasLeftIcon && "pl-9",
                rightElement && "pr-9",
                intent && `${eccgui}-intent--${intent}`,
                className,
            )}
            rows={isAutoResize ? 2 : rows}
            spellCheck={intent === "removed" ? false : undefined}
            {...domProps}
            dir={"auto"}
            onChange={maybeWrappedOnChange}
        />
    );

    const { className: wrapperClassName, ...otherWrapperDivProps } = wrapperDivProps ?? {};

    return wrapperDivProps || leftIcon || rightElement ? (
        <div
            className={cn(`${eccgui}-textarea__wrapper`, "relative", wrapperClassName)}
            {...otherWrapperDivProps}
        >
            {textarea}
            {hasLeftIcon && (
                <div
                    className={cn(
                        `${eccgui}-textarea__icon`,
                        "absolute top-2 left-3 z-10 flex cursor-text items-center text-muted-foreground",
                    )}
                    onClick={() => innerRef.current?.focus()}
                >
                    {typeof leftIcon === "string" ? (
                        <Icon name={leftIcon as ValidIconName} intent={iconIntent} />
                    ) : (
                        leftIcon
                    )}
                </div>
            )}
            {rightElement && (
                <div
                    className={cn(
                        `${eccgui}-textarea__options`,
                        "absolute top-2 right-2 z-10 flex items-center gap-1 text-right",
                        "grayscale hover:grayscale-0 peer-focus:grayscale-0",
                    )}
                >
                    {rightElement}
                </div>
            )}
        </div>
    ) : (
        textarea
    );
});

TextArea.displayName = "TextArea";

export default TextArea;
