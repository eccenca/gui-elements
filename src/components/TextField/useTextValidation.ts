import React, {ChangeEventHandler} from "react";
import chars from "../../common/utils/characters"

interface Props<T = Element> {
    value?: string | ReadonlyArray<string> | number | undefined;
    readOnly?: boolean | undefined;
    disabled?: boolean | undefined;
    onChange?: ChangeEventHandler<T>
    /**
     * If set, the function is called if any invisible, hard to spot characters in the string value are detected.
     */
    invisibleCharacterWarningCallback?: (detectedCodePoints: Set<number>) => any
}

/** Validates the string value for invisible characters. */
export const useTextValidation = <T>({value, onChange, invisibleCharacterWarningCallback}: Props<T>) => {
    const state = React.useRef<{
        checkedValue?: string | ReadonlyArray<string> | number,
        timeout?: number,
        detectedCodePoints: Set<number>
    }>({detectedCodePoints: new Set()})
    const clearState = React.useCallback(() => {
        state.current.timeout && clearTimeout(state.current.timeout)
        state.current.checkedValue = undefined
        state.current.detectedCodePoints = new Set()
    }, [])
    const detectionRegex = React.useMemo(() => chars.invisibleZeroWidthCharacters.createRegex(), [])
    const detectIssues = React.useCallback((value: string): void => {
        detectionRegex.lastIndex = 0
        let matchArray = detectionRegex.exec(value)
        while(matchArray) {
            const codePoint = matchArray[0].codePointAt(0)
            if(codePoint) {
                state.current.detectedCodePoints.add(codePoint)
            }
            matchArray = detectionRegex.exec(value)
        }
    }, [detectionRegex])
    // Checks if the value contains any problematic characters with a small delay.
    const checkValue = React.useCallback((value: string | ReadonlyArray<string> | number) => {
        state.current.detectedCodePoints = new Set()
        if(typeof value === "number") {
            clearState()
        } else if(typeof value === "string") {
            detectIssues(value)
        } else {
            value.forEach((arrayValue) => detectIssues(arrayValue))
        }
        if(state.current.detectedCodePoints.size) {
            console.log("checking...")
            invisibleCharacterWarningCallback?.(state.current.detectedCodePoints)
        }
    }, [invisibleCharacterWarningCallback, clearState, detectIssues])
    const scheduleCheck = React.useCallback((value: string | ReadonlyArray<string> | number) => {
        if(state.current.checkedValue === value) {
            return
        }
        state.current.checkedValue = value
        state.current.timeout = window.setTimeout(() => {
            if(state.current.checkedValue === value) {
                checkValue(value)
                clearState()
            }
        }, 500)
    }, [checkValue, clearState])
    // Do check via onChange handler
    const wrappedOnChangeHandler: ChangeEventHandler<T> = React.useCallback((event) => {
        const {value} = event.target as any
        if(value != null && typeof value === "string") {
            scheduleCheck(value)
        } else {
            clearState()
        }
        onChange?.(event)
    }, [clearState, onChange, scheduleCheck])
    // No callback, return
    if(!invisibleCharacterWarningCallback) {
        return onChange
    }
    if(value == null && onChange == null) {
        return onChange
    }
    if(value != null) {
        scheduleCheck(value)
        return onChange
    } else {
        return wrappedOnChangeHandler
    }
}
