import React from "react";
import {
  TextArea as BlueprintTextArea,
  Intent as BlueprintIntent,
  TextAreaProps as BlueprintTextAreaProps,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {InvisibleCharacterWarningProps, useTextValidation} from "./useTextValidation";

export interface TextAreaProps extends Partial<BlueprintTextAreaProps> {
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
     * If set, allows to be informed of invisible, hard to spot characters in the string value.
     */
    invisibleCharacterWarning?: InvisibleCharacterWarningProps
}

function TextArea({
  className = "",
  hasStatePrimary = false,
  hasStateSuccess = false,
  hasStateWarning = false,
  hasStateDanger = false,
  rows = 5,
  invisibleCharacterWarning,
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

  const maybeWrappedOnChange = useTextValidation({...otherProps, invisibleCharacterWarning})

  return (
    <BlueprintTextArea
      className={`${eccgui}-textarea ` + className}
      intent={intent}
      rows={rows ? rows : undefined}
      {...otherProps}
      dir={"auto"}
      onChange={maybeWrappedOnChange}
    />
  );
}

export default TextArea;
