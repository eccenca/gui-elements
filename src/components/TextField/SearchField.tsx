import React from "react";

import { TestableComponent } from "../../components/interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "../Icon/Icon";
import IconButton from "../Icon/IconButton";

import TextField, { TextFieldProps } from "./TextField";

export interface SearchFieldProps extends TestableComponent, Omit<TextFieldProps, "placeholder" | "fullWidth"> {
    /**
     * Placeholder text for search box.
     */
    emptySearchInputMessage?: string;
    /**
     * Event handler to reset search input.
     * If set then `rightElement` is automatically set with an action button to trigger the handler.
     */
    onClearanceHandler?: () => void;
    /**
     * Tooltip to show for the clear button.
     */
    onClearanceText?: string;
}

/**
 * Special `TextField` element for search term inputs.
 */
export const SearchField = ({
    className = "",
    emptySearchInputMessage = "Enter search term",
    onClearanceHandler,
    onClearanceText = "Clear current search term",
    onChange,
    leftIcon = <Icon name="operation-search" />,
    rightElement,
    ...otherProps
}: SearchFieldProps) => {
    const [value, setValue] = React.useState<string>("");

    const clearanceButton =
        onClearanceHandler && value ? (
            <IconButton
                data-test-id={otherProps["data-test-id"] && `${otherProps["data-test-id"]}-clear-btn`}
                name="operation-clear"
                text={onClearanceText}
                onClick={() => {
                    setValue("");
                    onClearanceHandler();
                }}
            />
        ) : undefined;

    const changeHandlerProcess = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };

    React.useEffect(() => {
        setValue(otherProps.value ?? otherProps.defaultValue ?? "");
    }, [otherProps.value, otherProps.defaultValue]);

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
                (clearanceButton || rightElement) && (
                    <>
                        {rightElement}
                        {clearanceButton}
                    </>
                )
            }
            onChange={changeHandlerProcess}
            {...otherProps}
            value={value}
            type={"search"}
            leftIcon={leftIcon}
            round={true}
        />
    );
};

export default SearchField;
