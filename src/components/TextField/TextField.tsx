import React from "react";
import {
  InputGroup as BlueprintInputGroup,
  Classes as BlueprintClassNames,
  Intent as BlueprintIntent,
} from "@blueprintjs/core";
import Icon from "../Icon/Icon";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { HTMLInputProps } from "@blueprintjs/core/lib/esm/common/props";
import { IInputGroupProps } from "@blueprintjs/core/lib/esm/components/forms/inputGroup";

export interface TextFieldProps
  extends Partial<IInputGroupProps & HTMLInputProps> {
  className?: string;
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
}

/** Text input field. */
function TextField({
  className = "",
  hasStatePrimary = false,
  hasStateSuccess = false,
  hasStateWarning = false,
  hasStateDanger = false,
  fullWidth = false,
  leftIcon,
  ...otherProps
}: TextFieldProps) {
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
    <BlueprintInputGroup
      className={`${eccgui}-textfield ` + className}
      intent={intent}
      fill={fullWidth}
      {...otherProps}
      leftIcon={
        leftIcon != null && leftIcon !== false ? (
          typeof leftIcon === "string" ? (
            <Icon
              name={leftIcon}
              className={BlueprintClassNames.ICON}
              intent={intent}
            />
          ) : (
            <span className={BlueprintClassNames.ICON}>{leftIcon}</span>
          )
        ) : undefined
      }
      dir={"auto"}
    />
  );
}

export default TextField;
