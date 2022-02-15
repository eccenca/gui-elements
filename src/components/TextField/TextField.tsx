import React from "react";
import {
    InputGroup as BlueprintInputGroup,
    Classes as BlueprintClassNames,
    Intent as BlueprintIntent,
    MaybeElement,
    InputGroupProps,
    HTMLInputProps,
} from "@blueprintjs/core";
import Icon from "../Icon/Icon";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {ValidIconName} from "../Icon/canonicalIconNames";

export interface TextFieldProps extends Omit<Partial<InputGroupProps & HTMLInputProps>, "intent"> {
    /**
    * The input element is displayed with primary color scheme.
    */
    hasStatePrimary?: boolean;
    /**
    * The input element is displayed with success (some type of green) color scheme.
    */
    hasStateSuccess?: boolean;
    /**
    * The input element is displayed with success (some type of orange) color scheme.
    */
    hasStateWarning?: boolean;
    /**
    * The input element is displayed with success (some type of red) color scheme.
    */
    hasStateDanger?: boolean;
    /**
     * The input element uses the full horizontal width of the parent container.
     */
    fullWidth?: boolean;
    leftIcon?: ValidIconName | MaybeElement;
}

/**
  * Text input field.
  */
function TextField({
  className = "",
  hasStatePrimary = false,
  hasStateSuccess = false,
  hasStateWarning = false,
  hasStateDanger = false,
  fullWidth = true,
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
