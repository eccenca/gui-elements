import React, {useEffect, useState} from "react";
import {
    Overlay as BlueprintOverlay,
    OverlayProps as BlueprintOverlayProps,
    Spinner as BlueprintSpinner,
    SpinnerProps as BlueprintSpinnerProps
} from "@blueprintjs/core";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";

export type SpinnerPosition = "local" | "inline" | "global"
export type SpinnerSize = "tiny" | "small" | "medium" | "large" | "xlarge" | "inherit"
export type SpinnerStroke = "thin" | "medium" | "bold"
type Intent = "inherit" | "primary" | "success" | "warning" | "danger"

/** A spinner that is either displayed globally or locally. */
export interface SpinnerProps extends Partial<BlueprintOverlayProps & Omit<BlueprintSpinnerProps, "size">> {
    /**
     * intent value or a valid css color definition
     */
    color?: Intent | string
    /**
     * Additional CSS class names.
     */
    className?: string
    /**
     * Position where and how the spinner is displayed:
     * * `local`: the spinner is displayed as centered overlay to the neareast parent with relative (or equivalent) positioning
     * * `inline`: the spinner is displayed as inline element
     * * `global`: the spinner is displayed including backdrop centered over the full viewport
     */
    position?: SpinnerPosition
    /**
     * The size of the spinner.
     * The default size relates to the `position`.
     */
    size?: SpinnerSize
    /**
     * The stroke width that is used to visualize the spinner.
     * The default size relates to the `position`.
     * There are only rare cases to set this property,
     */
    stroke?: SpinnerStroke
    /**
     * Delay when to show the spinner in ms.
     */
    delay?: number
    /**
     * Includes a backdrop behind the spinner that narrows visibility of the area behind the spinner.
     * This option only works with "local" spinners, for "inline" spinners there is no backdrop, "global" spinners always have backdrops.
     * The backdrop and the spinner are located over the nearest parent element that is styled by `position: relative` or some other CSS rule with an equivalent outcome.
     */
    showLocalBackdrop?: boolean
    /**
     * Label displayed next to the spinner (planned).
     * You can set it to document the purpose of the spinner.
     * It is currently not supported and not displayed.
     */
    description?: string
}

function Spinner({
    className = "",
    color = "inherit",
    position = "local",
    size,
    stroke,
    showLocalBackdrop = false,
    delay = 0,
    description = "Loading indicator", // currently unsupported (FIXME):
    ...otherProps
}: SpinnerProps) {
    const [showSpinner, setShowSpinner] = useState<boolean>(!delay || delay <= 0);
    useEffect(() => {
        if(!showSpinner) {
            const timeoutId = setTimeout(() => setShowSpinner(true), delay);
            return () => clearTimeout(timeoutId);
        }
        return;
    }, [showSpinner, delay]);
    const availableIntent = ["primary", "success", "warning", "danger", "inherit"];
    const internSizes = {
        thin: 100,
        medium: 50,
        bold: 10
    };

    const spinnerElement = position === "inline" ? "span" : "div";
    const spinnerColor = availableIntent.indexOf(color) < 0 ? color : null;
    const spinnerIntent = availableIntent.indexOf(color) < 0 ? "usercolor" : color;

    let spinnerSize;
    let spinnerStroke;
    switch (position) {
        case "local":
            spinnerSize = size ?? "medium";
            spinnerStroke = stroke ?? "medium";
            break;
        case "global":
            spinnerSize = size ?? "large";
            spinnerStroke = stroke ?? "thin";
            break;
        case "inline":
            spinnerSize = size ?? "inherit";
            spinnerStroke = stroke ?? "bold";
            break;
        default:
            spinnerSize = size ?? "medium";
            spinnerStroke = stroke ?? "medium";
    }

    let spinner = (
        <BlueprintSpinner
            size={internSizes[spinnerStroke]}
            tagName={spinnerElement}
            className={
                `${eccgui}-spinner` +
                ` ${eccgui}-spinner--position-${position}` +
                ` ${eccgui}-spinner--intent-${spinnerIntent}` +
                ` ${eccgui}-spinner--size-${spinnerSize}` +
                (showLocalBackdrop ? ` ${eccgui}-spinner--localbackdrop` : "") +
                (className ? " " + className : "")

            }
            {...otherProps}
        />
    );

    if (spinnerColor) {
        spinner = <span style={{ color: spinnerColor }}>{spinner}</span>;
    }

    return position === "global" ? (
        <BlueprintOverlay
            {...otherProps}
            className={`${eccgui}-spinner__overlay`}
            backdropClassName={`${eccgui}-spinner__backdrop`}
            canOutsideClickClose={false}
            canEscapeKeyClose={false}
            hasBackdrop={true}
            isOpen={true}
        >
            {spinner}
        </BlueprintOverlay>
    ) : (
        showSpinner ? spinner : null
    );
}

export default Spinner;
