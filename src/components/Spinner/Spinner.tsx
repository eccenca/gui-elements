import React from "react";
import { Spinner as BlueprintSpinner, Overlay as BlueprintOverlay } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Spinner({
    className = "",
    color = "inherit", // primary | success | warning | danger | inherit | colordefinition (red, #0f0, ...)
    description = "Loading indicator", // currently unsupported (TODO)
    position = "local", // global | local | inline
    size, // tiny | small | medium | large | xlarge | inherit
    stroke, // thin | medium | bold
    ...otherProps
}: any) {
    const availableColor = ["primary", "success", "warning", "danger", "inherit"];
    const internSizes = {
        thin: 100,
        medium: 50,
        bold: 10,
    };

    const spinnerElement = position === "inline" ? "span" : "div";
    const spinnerColor = availableColor.indexOf(color) < 0 ? color : null;
    const spinnerIntent = availableColor.indexOf(color) < 0 ? "usercolor" : color;

    const availableSize = ["tiny", "small", "medium", "large", "xlarge", "inherit"];
    let spinnerSize;
    const availableStroke = ["thin", "medium", "bold"];
    let spinnerStroke;
    switch (position) {
        case "local":
            spinnerSize = "medium";
            spinnerStroke = "medium";
            break;
        case "global":
            spinnerSize = "large";
            spinnerStroke = "thin";
            break;
        case "inline":
            spinnerSize = "inherit";
            spinnerStroke = "bold";
            break;
        default:
            spinnerSize = availableSize.indexOf(size) < 0 ? "medium" : size;
            spinnerStroke = availableStroke.indexOf(stroke) < 0 ? "medium" : stroke;
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
        spinner
    );
}

export default Spinner;
