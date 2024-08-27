import React from "react";
import {
    Classes as BlueprintClassNames,
    Intent as BlueprintIntent,
    MaybeElement,
    TextArea as BlueprintTextArea,
    TextAreaProps as BlueprintTextAreaProps,
} from "@blueprintjs/core";

import { Definitions as IntentDefinitions, IntentTypes } from "../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { Icon } from "../Icon";
import { ValidIconName } from "../Icon/canonicalIconNames";

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
    /**
     * Left aligned icon, can be a canonical icon name or an `Icon` element.
     * This will update left padding on the text area.
     */
    leftIcon?: ValidIconName | MaybeElement;
    /**
     * Element to render on right side of text area. Should be not too large.
     * This will update right padding on the text area.
     */
    rightElement?: JSX.Element;
    /**
     * Add HTML properties to the wrapper element.
     * The element wraps `TextArea` in case of a given `wrapperDivProps`, `leftIcon` or `rightElement` property.
     */
    wrapperDivProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
}

export const TextArea = ({
    className = "",
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    rows = 5,
    invisibleCharacterWarning,
    leftIcon,
    rightElement,
    wrapperDivProps,
    ...otherProps
}: TextAreaProps) => {
    const textAreaCallback = React.useCallback(
        (textAreaElement: HTMLTextAreaElement) => {
            if (textAreaElement && typeof textAreaElement === "object") {
                let textAreaStyle: CSSStyleDeclaration;
                if (!textAreaElement.dataset.processed) {
                    textAreaStyle = getComputedStyle(textAreaElement);
                    textAreaElement.dataset.processed = "yes";
                    textAreaElement.dataset.paddingtop = textAreaStyle.paddingTop ?? "0px";
                    textAreaElement.dataset.paddingleft = textAreaStyle.paddingLeft ?? "0px";
                    textAreaElement.dataset.paddingright = textAreaStyle.paddingRight ?? "0px";
                } else {
                    textAreaStyle = {
                        paddingTop: textAreaElement.dataset.paddingtop ?? "0px",
                        paddingLeft: textAreaElement.dataset.paddingleft ?? "0px",
                        paddingRight: textAreaElement.dataset.paddingright ?? "0px",
                    } as CSSStyleDeclaration;
                }
                const textAreaElementRect = textAreaElement.getBoundingClientRect();
                const wrapperElement = textAreaElement.parentElement;

                if (leftIcon && wrapperElement) {
                    const leftIconElement = wrapperElement.querySelector(`.${eccgui}-textarea__icon`) as HTMLElement;
                    const leftIconElementRect = leftIconElement.getBoundingClientRect();
                    if (
                        parseInt(textAreaStyle.paddingTop, 10) * 2 + (leftIconElementRect.height ?? 0) <=
                        (textAreaElementRect.height ?? 0)
                    ) {
                        leftIconElement.style.setProperty("top", textAreaStyle.paddingTop);
                    } else {
                        leftIconElement.style.setProperty(
                            "top",
                            `${((textAreaElementRect.height ?? 0) - (leftIconElementRect.height ?? 0)) * 0.5}px`
                        );
                    }
                    leftIconElement.style.setProperty("left", textAreaStyle.paddingLeft);
                    textAreaElement.style.setProperty(
                        "padding-left",
                        `calc(${leftIconElementRect.width ? 2 : 1} * ${textAreaStyle.paddingLeft} + ${
                            leftIconElementRect.width ?? 0
                        }px)`
                    );
                    leftIconElement.addEventListener("click", (_event: MouseEvent) => {
                        textAreaElement.focus();
                    });
                }

                if (rightElement && wrapperElement) {
                    const rightElementElement = wrapperElement.querySelector(
                        `.${eccgui}-textarea__options`
                    ) as HTMLElement;
                    const rightElementElementRect = rightElementElement.getBoundingClientRect();
                    if (
                        parseInt(textAreaStyle.paddingTop, 10) * 2 + (rightElementElementRect.height ?? 0) <=
                        (textAreaElementRect.height ?? 0)
                    ) {
                        rightElementElement.style.setProperty("top", textAreaStyle.paddingTop);
                    } else {
                        rightElementElement.style.setProperty(
                            "top",
                            `${((textAreaElementRect.height ?? 0) - (rightElementElementRect.height ?? 0)) * 0.5}px`
                        );
                    }
                    rightElementElement.style.setProperty("right", textAreaStyle.paddingRight);
                    textAreaElement.style.setProperty(
                        "padding-right",
                        `calc(${rightElementElementRect.width ? 2 : 1} * ${textAreaStyle.paddingRight} + ${
                            rightElementElementRect.width ?? 0
                        }px)`
                    );
                }
            }
        },
        [leftIcon, rightElement]
    );

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

    const textarea = (
        <BlueprintTextArea
            inputRef={textAreaCallback}
            className={
                `${eccgui}-textarea` +
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

    const { className: wrapperClassName, ...otherWrapperDivProps } = wrapperDivProps ?? {};

    return wrapperDivProps || leftIcon || rightElement ? (
        <div
            className={`${eccgui}-textarea__wrapper` + (wrapperClassName ? ` ${wrapperClassName}` : "")}
            {...otherWrapperDivProps}
        >
            {textarea}
            {leftIcon && (
                <div className={`${eccgui}-textarea__icon`}>
                    {typeof leftIcon === "string" ? (
                        <Icon
                            name={leftIcon as ValidIconName}
                            className={BlueprintClassNames.ICON}
                            intent={iconIntent as IntentTypes | undefined}
                        />
                    ) : (
                        <span className={BlueprintClassNames.ICON}>{leftIcon}</span>
                    )}
                </div>
            )}
            {rightElement && <div className={`${eccgui}-textarea__options`}>{rightElement}</div>}
        </div>
    ) : (
        textarea
    );
};

export default TextArea;
