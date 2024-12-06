import React, { KeyboardEventHandler, RefObject } from "react";
import {
    Classes as BlueprintClassNames,
    HTMLInputProps,
    InputGroup as BlueprintInputGroup,
    InputGroupProps as BlueprintInputGroupProps,
    Intent as BlueprintIntent,
    MaybeElement,
} from "@blueprintjs/core";

import { Definitions as IntentDefinitions, IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { ValidIconName } from "../Icon/canonicalIconNames";
import Icon from "../Icon/Icon";

import { InvisibleCharacterWarningProps, useTextValidation } from "./useTextValidation";

export interface TextFieldProps
    extends Partial<Omit<BlueprintInputGroupProps, "intent" | "leftIcon" | "leftElement"> & HTMLInputProps> {
    /**
     * Intent state of the text field.
     */
    intent?: IntentTypes | "edited" | "removed";
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
    invisibleCharacterWarning?: InvisibleCharacterWarningProps;

    /** If true pressing the Escape key will blur/de-focus the input field. Default: false */
    escapeToBlur?: boolean;
}

/**
 * Text input field.
 */
export const TextField = ({
    className = "",
    fullWidth = true,
    leftIcon,
    invisibleCharacterWarning,
    escapeToBlur = false,
    intent,
    ...otherBlueprintInputGroupProps
}: TextFieldProps) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const handleLabelEscape = React.useCallback(() => {
        inputRef.current?.blur();
        if (otherBlueprintInputGroupProps.inputRef) {
            const otherInputRef = otherBlueprintInputGroupProps.inputRef as RefObject<HTMLInputElement>;
            if (otherInputRef.current) {
                otherInputRef.current.blur();
            }
        }
    }, []);

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = React.useCallback(
        (event) => {
            if (escapeToBlur && event.key === "Escape") {
                event.preventDefault();
                handleLabelEscape();
                return false;
            }

            if (otherBlueprintInputGroupProps.type === "number") {
                const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
                const inputValue = (event.target as HTMLInputElement).value;

                if (event.key === "-" && inputValue.length === 0) {
                    return;
                }

                if (event.key === "." && !inputValue.includes(".")) {
                    return;
                }

                if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
                    event.preventDefault();
                }
            }

            return otherBlueprintInputGroupProps.onKeyDown?.(event);
        },
        [otherBlueprintInputGroupProps.onKeyDown, otherBlueprintInputGroupProps.type, escapeToBlur]
    );

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

    const maybeWrappedOnChange = useTextValidation({ ...otherBlueprintInputGroupProps, invisibleCharacterWarning });

    if (
        (otherBlueprintInputGroupProps.readOnly || otherBlueprintInputGroupProps.disabled) &&
        !!otherBlueprintInputGroupProps.value &&
        !otherBlueprintInputGroupProps.title
    ) {
        otherBlueprintInputGroupProps["title"] = otherBlueprintInputGroupProps.value;
    }

    const isKeyDownShouldBeTriggered =
        otherBlueprintInputGroupProps.onKeyDown || escapeToBlur || otherBlueprintInputGroupProps.type === "number";

    return (
        <BlueprintInputGroup
            inputRef={inputRef}
            className={
                `${eccgui}-textfield` +
                (intent ? ` ${eccgui}-intent--${intent}` : "") +
                (className ? ` ${className}` : "")
            }
            intent={
                intent && !["info", "edited", "removed", "neutral"].includes(intent)
                    ? (intent as BlueprintIntent)
                    : undefined
            }
            fill={fullWidth}
            {...otherBlueprintInputGroupProps}
            leftElement={
                leftIcon != null && leftIcon !== false ? (
                    typeof leftIcon === "string" ? (
                        <Icon
                            name={leftIcon as ValidIconName}
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
            onKeyDown={isKeyDownShouldBeTriggered ? onKeyDown : undefined}
        />
    );
};

export default TextField;
