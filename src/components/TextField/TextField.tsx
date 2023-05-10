import React from "react";
import {
    InputGroup as BlueprintInputGroup,
    Classes as BlueprintClassNames,
    Intent as BlueprintIntent,
    MaybeElement,
    HTMLInputProps,
    InputGroupProps2,
} from "@blueprintjs/core";
import { IntentTypes, Definitions as IntentDefinitions } from "../../common/Intent";
import Icon from "../Icon/Icon";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {ValidIconName} from "../Icon/canonicalIconNames";
import {InvisibleCharacterWarningProps, useTextValidation} from "./useTextValidation";

export interface TextFieldProps extends Partial<Omit<InputGroupProps2, "intent" | "leftIcon" | "leftElement"> & HTMLInputProps> {
    /**
    * The input element is displayed with primary color scheme.
    * @deprecated
    */
    hasStatePrimary?: boolean;
    /**
    * The input element is displayed with success (some type of green) color scheme.
    * @deprecated
    */
    hasStateSuccess?: boolean;
    /**
    * The input element is displayed with warning (some type of orange) color scheme.
    * @deprecated
    */
    hasStateWarning?: boolean;
    /**
    * The input element is displayed with danger (some type of red) color scheme.
    * @deprecated
    */
    hasStateDanger?: boolean;
    /**
     * Intent state of the text field.
     */
    intent?: IntentTypes | "edited" | "removed"
    /**
     * The input element uses the full horizontal width of the parent container.
     */
    fullWidth?: boolean;
    /**
     * Left aligned icon, can be a canonical icon name or an `Icon` element.
     */
    leftIcon?: ValidIconName | MaybeElement;
    /**
     * If set, allows to be informed of invisible, hard to spot characters in the string value.
     */
    invisibleCharacterWarning?: InvisibleCharacterWarningProps
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
  invisibleCharacterWarning,
  ...otherProps
}: TextFieldProps) {
  let deprecatedIntent;
  switch (true) {
    case hasStatePrimary:
      deprecatedIntent = IntentDefinitions.PRIMARY;
      break;
    case hasStateSuccess:
      deprecatedIntent = IntentDefinitions.SUCCESS;
      break;
    case hasStateWarning:
      deprecatedIntent = IntentDefinitions.WARNING;
      break;
    case hasStateDanger:
      deprecatedIntent = IntentDefinitions.DANGER;
      break;
    default:
      break;
  }

  const {
      intent = deprecatedIntent,
      ...otherBlueprintInputGroupProps
  } = otherProps;

  let iconIntent;
  switch (intent) {
      case "edited":
        iconIntent = IntentDefinitions.INFO;
        break;
      case "removed":
        iconIntent = IntentDefinitions.DANGER;
        break;
      default:
        iconIntent = intent as IntentTypes;
        break;
  }

  const maybeWrappedOnChange = useTextValidation({...otherBlueprintInputGroupProps, invisibleCharacterWarning})

  if ((otherBlueprintInputGroupProps.readOnly || otherBlueprintInputGroupProps.disabled) && !!otherBlueprintInputGroupProps.value && !otherBlueprintInputGroupProps.title) {
      otherBlueprintInputGroupProps["title"] = otherBlueprintInputGroupProps.value;
  }

  return (
    <BlueprintInputGroup
      className={
          `${eccgui}-textfield` +
          (intent ? ` ${eccgui}-intent--${intent}` : "") +
          (!!className ? ` ${className}` : "")
      }
      intent={(intent && !(["info", "edited", "removed", "neutral"].includes(intent))) ? intent as BlueprintIntent : undefined}
      fill={fullWidth}
      {...otherBlueprintInputGroupProps}
      leftElement={
        leftIcon != null && leftIcon !== false ? (
          typeof leftIcon === "string" ? (
            <Icon
              name={leftIcon}
              className={BlueprintClassNames.ICON}
              intent={iconIntent as IntentTypes | undefined}
            />
          ) : (
            <span className={BlueprintClassNames.ICON}>{leftIcon}</span>
          )
        ) : undefined
      }
      dir={"auto"}
      onChange={maybeWrappedOnChange}
    />
  );
}

export default TextField;
