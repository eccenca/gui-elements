import React, {useEffect, useState} from "react";
import {
    Overlay as BlueprintOverlay,
    OverlayProps as BlueprintOverlayProps,
    Position,
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
    // intent value or a valid css color definition
    color?: Intent | string
    className?: string
    description?: string
    position?: SpinnerPosition
    size?: SpinnerSize
    stroke?: SpinnerStroke
    // Delay when to show the spinner in ms, default: 0
    delay?: number
}

function Spinner({
    className = "",
    color = "inherit",
    description = "Loading indicator", // currently unsupported (TODO)
    position = "local",
    size,
    stroke,
    delay = 0,
    ...otherProps
}: SpinnerProps) {
    const [showSpinner, setShowSpinner] = useState<boolean>(!delay || delay <= 0);
    useEffect(() => {
        if(!showSpinner) {
            const timeoutId = setTimeout(() => setShowSpinner(true), delay);
            return () => clearTimeout(timeoutId);
        }
    }, [showSpinner, delay])
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
            spinnerSize = size ?? "medium"
            spinnerStroke = stroke ?? "medium"
    }

    let spinner = (
        <BlueprintSpinner
            size={internSizes[spinnerStroke]}
            tagName={spinnerElement}
            className={
                `${eccgui}-spinner` +
                (className ? " " + className : "") +
                ` ${eccgui}-spinner--intent-` +
                spinnerIntent +
                ` ${eccgui}-spinner--size-` +
                spinnerSize
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
