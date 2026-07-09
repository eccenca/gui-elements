import React from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Public prop contract for {@link Checkbox}.
 *
 * Kept structurally identical to the historical Blueprint `CheckboxProps`
 * (`ControlProps` + `indeterminate`/`defaultIndeterminate`) so that the public
 * API stays frozen. In particular `onChange` remains a native
 * `React.ChangeEventHandler<HTMLInputElement>` — consumers rely on reading
 * `e.target.checked` / `e.currentTarget.checked` / `e.target.value`.
 */
export interface CheckboxProps extends Omit<HTMLInputProps, "size"> {
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
    /** Name of the HTML tag that wraps the checkbox. */
    tagName?: keyof React.JSX.IntrinsicElements;
    /** Whether this checkbox is initially indeterminate (uncontrolled mode). */
    defaultIndeterminate?: boolean;
    /** Whether this checkbox is indeterminate, or "partially checked." */
    indeterminate?: boolean;
}

export const Checkbox = ({
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
    defaultIndeterminate,
    indeterminate,
    onChange,
    ...inputProps
}: CheckboxProps) => {
    const [isIndeterminate, setIsIndeterminate] = React.useState<boolean>(
        indeterminate || defaultIndeterminate || false
    );

    const localInputRef = React.useRef<HTMLInputElement | null>(null);
    const setInputRef = React.useCallback(
        (node: HTMLInputElement | null) => {
            localInputRef.current = node;
            if (typeof inputRef === "function") {
                inputRef(node);
            } else if (inputRef) {
                (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
        },
        [inputRef]
    );

    const handleChange = React.useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            // update state immediately only if uncontrolled
            if (indeterminate === undefined) {
                setIsIndeterminate(evt.target.indeterminate);
            }
            // otherwise wait for props change. always invoke handler.
            onChange?.(evt);
        },
        [indeterminate, onChange]
    );

    // keep controlled indeterminate state in sync
    React.useEffect(() => {
        if (indeterminate !== undefined) {
            setIsIndeterminate(indeterminate);
        }
    }, [indeterminate]);

    // `indeterminate` is a DOM property with no HTML attribute, so it has to be set imperatively
    React.useEffect(() => {
        if (localInputRef.current != null) {
            localInputRef.current.indeterminate = isIndeterminate;
        }
    }, [isIndeterminate]);

    const large_ = large || size === "large";
    const alignRight = alignIndicator === "right" || alignIndicator === "end";
    const hasLabelContent = label != null || labelElement != null || children != null;

    return React.createElement(
        tagName,
        {
            className: cn(
                `${eccgui}-checkbox`,
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
            ref={setInputRef}
            type="checkbox"
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only outline-none"
        />,
        <span
            aria-hidden
            className={cn(
                // the icon inside uses `currentColor`; keep it transparent until checked so it stays hidden
                "grid shrink-0 place-content-center rounded-[4px] border border-input bg-card text-transparent shadow-xs transition-colors",
                large_ ? "size-5" : "size-4",
                "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground",
                "peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
                "peer-disabled:opacity-50",
                isIndeterminate && "border-primary bg-primary text-primary-foreground"
            )}
        >
            {isIndeterminate ? (
                <Minus className="size-3.5" />
            ) : (
                <Check className="size-3.5" />
            )}
        </span>,
        hasLabelContent ? (
            <span key="label" className={cn("min-w-0", disabled && "opacity-50")}>
                {label}
                {labelElement}
                {children}
            </span>
        ) : null
    );
};

export default Checkbox;
