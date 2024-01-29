import React, { ChangeEventHandler } from "react";

import chars from "../../common/utils/characters";

export interface InvisibleCharacterWarningProps {
    /**
     * If set, the function is called after every value change what invisible characters have been detected.
     * The input component must be controlled for this callback to be triggered.
     */
    callback: (detectedCodePoints: Set<number>) => any;
    /**
     * The delay in milliseconds after which an input string should be checked. Only the most recent value will be checked.
     * A higher value will reduce the probability that the typing stalls.
     *
     * Default: 500
     */
    callbackDelay?: number;
}

interface Props<T = Element> {
    /** Forwarded TextField props */
    value?: string | ReadonlyArray<string> | number | undefined;
    readOnly?: boolean | undefined;
    disabled?: boolean | undefined;
    onChange?: ChangeEventHandler<T>;
    /**
     * If set, allows to be informed of invisible, hard to spot characters in the string value.
     */
    invisibleCharacterWarning?: InvisibleCharacterWarningProps;
}

/** Validates the string value for invisible characters. */
export const useTextValidation = <T>({ value, onChange, invisibleCharacterWarning }: Props<T>) => {
    const callback = invisibleCharacterWarning?.callback;
    const callbackDelay = invisibleCharacterWarning?.callbackDelay;
    const state = React.useRef<{
        checkedValue?: string | ReadonlyArray<string> | number;
        timeout?: number;
        detectedCodePoints: Set<number>;
    }>({ detectedCodePoints: new Set() });
    const clearState = React.useCallback(() => {
        state.current.timeout && clearTimeout(state.current.timeout);
        state.current.checkedValue = undefined;
        state.current.detectedCodePoints = new Set();
    }, []);
    const detectionRegex = React.useMemo(() => chars.invisibleZeroWidthCharacters.createRegex(), []);
    const detectIssues = React.useCallback(
        (value: string): void => {
            detectionRegex.lastIndex = 0;
            let matchArray = detectionRegex.exec(value);
            while (matchArray) {
                const codePoint = matchArray[0].codePointAt(0);
                if (codePoint) {
                    state.current.detectedCodePoints.add(codePoint);
                }
                matchArray = detectionRegex.exec(value);
            }
        },
        [detectionRegex]
    );
    // Checks if the value contains any problematic characters with a small delay.
    const checkValue = React.useCallback(
        (value: string | ReadonlyArray<string> | number) => {
            state.current.detectedCodePoints = new Set();
            if (typeof value === "number") {
                clearState();
            } else if (typeof value === "string") {
                detectIssues(value);
            } else {
                value.forEach((arrayValue) => detectIssues(arrayValue));
            }
            callback?.(state.current.detectedCodePoints);
        },
        [callback, clearState, detectIssues]
    );
    const scheduleCheck = React.useCallback(
        (value: string | ReadonlyArray<string> | number) => {
            if (state.current.checkedValue === value) {
                return;
            }
            state.current.checkedValue = value;
            state.current.timeout = window.setTimeout(() => {
                if (state.current.checkedValue === value) {
                    checkValue(value);
                    clearState();
                }
            }, callbackDelay ?? 500);
        },
        [checkValue, clearState, callbackDelay]
    );
    // Do check via onChange handler
    const wrappedOnChangeHandler: ChangeEventHandler<T> = React.useCallback(
        (event) => {
            const { value } = event.target as any;
            if (value != null && typeof value === "string") {
                scheduleCheck(value);
            } else {
                clearState();
            }
            onChange?.(event);
        },
        [clearState, onChange, scheduleCheck]
    );
    // No callback, return
    if (!callback) {
        return onChange;
    }
    if (value == null && onChange == null) {
        return onChange;
    }
    if (value != null) {
        scheduleCheck(value);
        return onChange;
    } else {
        return wrappedOnChangeHandler;
    }
};
