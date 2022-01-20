import React from "react";
import { TextArea as BlueprintTextArea, Intent as BlueprintIntent } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";


interface TextAreaProps extends Partial<BlueprintTextArea> {
  className: string;
  /**
   * when set to true the input takes a blue border color
   */
  hasStatePrimary?: boolean;
  /**
   * when set to true the input takes a green border color
   */
  hasStateSuccess?: boolean;
  /**
   * when set to true the input takes an orange border color
   */
  hasStateWarning?: boolean;
  /**
   * when set to true the input takes a red border color
   */
  hasStateDanger?: boolean;
  /**
   * when set to true the input will take full-width of container box
   */
  fullWidth?: boolean;
  /**
   * Specifies the number of rows for the textarea
   */
  rows?: number | undefined;
}

function TextArea({
    className = "",
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    fullWidth = false,
    rows = 5,
    ...otherProps
}: TextAreaProps) {
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
            rows={rows ? rows : undefined}
            {...otherProps}
            dir={"auto"}
        />
    );
}

export default TextArea;
