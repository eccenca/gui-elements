import React from "react";

import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import Icon from "@/components/atoms/Icon/Icon";
import IconButton from "@/components/atoms/Icon/IconButton";

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
 * Native search-input decoration resets (ported from the former `textfield.scss`
 * `.eccgui-textfield--justifyclearance` block — SCSS sunset). Applied as descendant arbitrary
 * variants on the `TextField` wrapper so they reach the nested `<input type="search">`; static
 * strings only (no `${}`) so the Tailwind extractor sees them. The legacy `::-ms-clear`/`::-ms-reveal`
 * resets (pre-Chromium Edge/IE) are intentionally dropped.
 */
const searchClearanceResetClassName =
    "[&_input::-webkit-search-cancel-button]:appearance-none [&_input::-webkit-search-decoration]:appearance-none " +
    "[&_input::-webkit-search-results-button]:appearance-none [&_input::-webkit-search-results-decoration]:appearance-none";

/**
 * Special `TextField` element for search term inputs.
 */
export const SearchField = ({
    className = "",
    emptySearchInputMessage = "Enter search term",
    onClearanceHandler,
    onClearanceText = "Clear current search term",
    onChange,
    leftIcon = <Icon name="operation-search" small />,
    rightElement,
    round,
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
                (onClearanceHandler ? ` ${eccgui}-textfield--justifyclearance ${searchClearanceResetClassName}` : "") +
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
            round={round}
        />
    );
};

export default SearchField;
