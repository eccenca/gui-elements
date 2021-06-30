import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import IconButton from "../Icon/IconButton";
import TextField from "./TextField";
import {Icon} from "@gui-elements/index";

function SearchField({
    className = "",
    emptySearchInputMessage = "Enter search term",
    onClearanceHandler,
    onClearanceText,
    leftIcon = undefined,
    ...otherProps
}: any) {
    return (
        <TextField
            className={
                `${eccgui}-textfield--searchinput` +
                (onClearanceHandler ? ` ${eccgui}-textfield--justifyclearance` : "") +
                (className ? ` ${className}` : "")
            }
            dir={"auto"}
            placeholder={emptySearchInputMessage}
            aria-label={emptySearchInputMessage}
            rightElement={
                onClearanceHandler && otherProps.value ? (
                    <IconButton
                        data-test-id={otherProps["data-test-id"] && `${otherProps["data-test-id"]}-clear-btn`}
                        name="operation-clear"
                        text={onClearanceText ? onClearanceText : "Clear current search term"}
                        onClick={onClearanceHandler}
                    />
                ) : (
                    false
                )
            }
            {...otherProps}
            type={"search"}
            leftIcon={leftIcon ?? "operation-search"}
            round={true}
        />
    );
}

export default SearchField;
