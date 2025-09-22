import React from "react";

import { FieldItem, IconButton, TextArea, TextField, FieldItemProps } from "./../../index";

const extendedOnChange = (onChangeFn: any, event: any) => {
    if (typeof onChangeFn === "function") {
        onChangeFn({
            event,
            name: event.target.name,
            value: event.target.value,
            rawValue: event.target.value,
        });
    }
};

/** @deprecated (v25) all legacy component support will be removed, switch to `<TextField />`, `<TextArea />`, `<FieldItem />` */
export function TextFieldReplacement({
    className,
    disabled = false,
    error,
    inputClassName,
    label,
    multiline = false,
    onChange,
    onClearValue,
    // reducedSize = false,
    required = false,
    stretch = true,
    value,
    ...otherProps
}: any) {
    if (process.env.NODE_ENV === "development") {
        const debugMsg = [
            "This textfield element is a adhoc replacement for a legacy element. Usage is deprecated, please use a standard elements (FieldItem, TextField, TextArea).",
        ];
        if (typeof otherProps.reducedSize !== "undefined") {
            debugMsg.push("TextField 'reducedSize' property is currently not supported on legacy replacement element.");
            delete otherProps.reducedSize;
        }
        // eslint-disable-next-line no-console
        debugMsg.forEach((element) => console.debug(element));
    }
    if (typeof otherProps.reducedSize !== "undefined") {
        delete otherProps.reducedSize;
    }

    const InputElement = multiline ? TextArea : TextField;

    const fieldProperties = {
        className: className,
        messageText: error,
        labelProps: label ? { text: label } : {},
    };

    const inputProperties: { [key: string]: any } = {
        className: inputClassName,
        fullWidth: stretch,
        value: value,
        required: required,
        onChange: extendedOnChange.bind(null, onChange),
    };

    if (multiline) {
        delete inputProperties.fullWidth;
    }

    if (multiline === false && !!onClearValue && !!value) {
        inputProperties["rightElement"] = (
            <IconButton
                data-test-id={otherProps["data-test-id"] && `${otherProps["data-test-id"]}-clear-btn`}
                name="operation-clear"
                onClick={onClearValue}
            />
        );
    }

    const sharedProperties = {
        intent: error ? "danger" as FieldItemProps["intent"] : undefined,
        disabled: disabled,
    };

    return !!error || !!label ? (
        <FieldItem {...sharedProperties} {...fieldProperties}>
            <InputElement {...otherProps} {...sharedProperties} {...inputProperties} />
        </FieldItem>
    ) : (
        <InputElement {...otherProps} {...inputProperties} />
    );
}
