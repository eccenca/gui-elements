import React from "react";
import {
    Intent as BlueprintIntent,
    TextArea as BlueprintTextArea,
    TextAreaProps as BlueprintTextAreaProps,
} from "@blueprintjs/core";

import { Definitions as IntentDefinitions, IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { InvisibleCharacterWarningProps, useTextValidation } from "./useTextValidation";

export interface TextAreaProps extends Omit<BlueprintTextAreaProps, "intent"> {
    /**
     * when set to true the input takes a blue border color
     * @deprecated Use the `intent` property.
     */
    hasStatePrimary?: boolean;
    /**
     * when set to true the input takes a green border color
     * @deprecated Use the `intent` property.
     */
    hasStateSuccess?: boolean;
    /**
     * when set to true the input takes an orange border color
     * @deprecated Use the `intent` property.
     */
    hasStateWarning?: boolean;
    /**
     * when set to true the input takes a red border color
     * @deprecated Use the `intent` property.
     */
    hasStateDanger?: boolean;
    /**
     * Intent state of the text area.
     */
    intent?: IntentTypes | "edited" | "removed";
    /**
     * If set, allows to be informed of invisible, hard to spot characters in the string value.
     */
    invisibleCharacterWarning?: InvisibleCharacterWarningProps;
}

export const TextArea = ({
    className = "",
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    rows = 5,
    invisibleCharacterWarning,
    ...otherProps
}: TextAreaProps) => {
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

    const { intent = deprecatedIntent, ...otherBlueprintTextAreaProps } = otherProps;

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

    const maybeWrappedOnChange = useTextValidation({ ...otherBlueprintTextAreaProps, invisibleCharacterWarning });

    return (
        <BlueprintTextArea
            className={
                `${eccgui}-textarea ` +
                (intent ? ` ${eccgui}-intent--${intent}` : "") +
                (className ? ` ${className}` : "")
            }
            intent={
                intent && !["info", "edited", "removed", "neutral"].includes(intent)
                    ? (intent as BlueprintIntent)
                    : undefined
            }
            spellCheck={intent === "removed" ? false : undefined}
            rows={
                rows && !otherBlueprintTextAreaProps.autoResize && !otherBlueprintTextAreaProps.growVertically
                    ? rows
                    : 1
            }
            {...otherBlueprintTextAreaProps}
            dir={"auto"}
            onChange={maybeWrappedOnChange}
        />
    );
};

export default TextArea;
