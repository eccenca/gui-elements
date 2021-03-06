import React from "react";
import { TextArea as BlueprintTextArea, Intent as BlueprintIntent } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function TextArea({
    className = "",
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    fullWidth = false,
    rows = 5,
    ...otherProps
}: any) {
    let intent;
    switch (true) {
        case hasStatePrimary:
            intent = BlueprintIntent.PRIMARY;
            break;
        case hasStateSuccess:
            intent = BlueprintIntent.SUCCESS;
            break;
        case hasStateWarning:
            intent = BlueprintIntent.WARNING;
            break;
        case hasStateDanger:
            intent = BlueprintIntent.DANGER;
            break;
        default:
            break;
    }

    return (
        <BlueprintTextArea
            className={`${eccgui}-textarea ` + className}
            intent={intent}
            fill={fullWidth}
            rows={rows ? rows : false}
            {...otherProps}
            dir={"auto"}
        />
    );
}

export default TextArea;
