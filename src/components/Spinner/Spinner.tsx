import React, { useEffect, useState } from "react";
import {
    Overlay2 as BlueprintOverlay,
    OverlayProps as BlueprintOverlayProps,
    Spinner as BlueprintSpinner,
    SpinnerProps as BlueprintSpinnerProps,
} from "@blueprintjs/core";
import Color from "color";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

type SpinnerPosition = "local" | "inline" | "global";
type SpinnerSize = "tiny" | "small" | "medium" | "large" | "xlarge" | "inherit";
type SpinnerStroke = "thin" | "medium" | "bold";
type Intent = "primary" | "success" | "warning" | "danger";

/** A spinner that is either displayed globally or locally. */
export interface SpinnerProps extends Omit<BlueprintSpinnerProps, "size" | "intent" | "color"> {
    /**
     * Must be a valid css color definition.
     * `intent` property will always overwrite this setting.
     */
    color?: Color | string | "inherit";
    /**
     * Intent state of the field item.
     */
    intent?: Intent;
    /**
     * Additional CSS class names.
     */
    className?: string;
    /**
     * Position where and how the spinner is displayed:
     * * `local`: the spinner is displayed as centered overlay to the neareast parent with relative (or equivalent) positioning
     * * `inline`: the spinner is displayed as inline element
     * * `global`: the spinner is displayed including backdrop centered over the full viewport
     */
    position?: SpinnerPosition;
    /**
     * The size of the spinner.
     * The default size relates to the `position`.
     */
    size?: SpinnerSize;
    /**
     * The stroke width that is used to visualize the spinner.
     * The default size relates to the `position`.
     * There are only rare cases to set this property,
     */
    stroke?: SpinnerStroke;
    /**
     * Delay when to show the spinner in ms.
     */
    delay?: number;
    /**
     * Includes a backdrop behind the spinner that narrows visibility of the area behind the spinner.
     * This option only works with "local" spinners, for "inline" spinners there is no backdrop, "global" spinners always have backdrops.
     * The backdrop and the spinner are located over the nearest parent element that is styled by `position: relative` or some other CSS rule with an equivalent outcome.
     */
    showLocalBackdrop?: boolean;
    /**
     * Use this property to alter the display of the backdrop used for the global spinner
     */
    overlayProps?: BlueprintOverlayProps;
}

export const Spinner = ({
    className = "",
    color = "inherit",
    intent,
    position = "local",
    size,
    stroke,
    showLocalBackdrop = false,
    delay = 0,
    overlayProps,
    ...otherProps
}: SpinnerProps) => {
    const [showSpinner, setShowSpinner] = useState<boolean>(!delay || delay <= 0);
    useEffect(() => {
        if (!showSpinner) {
            const timeoutId = setTimeout(() => setShowSpinner(true), delay);
            return () => clearTimeout(timeoutId);
        }
        return;
    }, [showSpinner, delay]);

    const internSizes = {
        thin: 100,
        medium: 50,
        bold: 10,
    };

    const spinnerElement = position === "inline" ? "span" : "div";

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
                (intent ? ` ${eccgui}-spinner--intent-${intent}` : "") +
                ` ${eccgui}-spinner--size-${spinnerSize}` +
                (showLocalBackdrop ? ` ${eccgui}-spinner--localbackdrop` : "") +
                (className ? " " + className : "")
            }
            {...otherProps}
        />
    );

    if (!intent) {
        try {
            const spinnerColor = color === "inherit" ? color : Color(color).rgb().toString();
            spinner = <span style={{ color: spinnerColor }}>{spinner}</span>;
        } catch {
            spinner = <span style={{ color: "inherit" }}>{spinner}</span>;
            // eslint-disable-next-line no-console
            console.warn("Spinner received invalid color property: " + color);
        }
    }

    return position === "global" ? (
        <BlueprintOverlay
            {...overlayProps}
            className={`${eccgui}-spinner__overlay`}
            backdropClassName={`${eccgui}-spinner__backdrop`}
            canOutsideClickClose={false}
            canEscapeKeyClose={false}
            hasBackdrop={true}
            isOpen={true}
        >
            {spinner}
        </BlueprintOverlay>
    ) : showSpinner ? (
        spinner
    ) : null;
};

export default Spinner;
