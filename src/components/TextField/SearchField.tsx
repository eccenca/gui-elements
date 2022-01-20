import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import IconButton from "../Icon/IconButton";
import TextField, { TextFieldProps } from "./TextField";

interface SearchFieldProps extends TextFieldProps {
  /**
   * placeholder text
   */
  emptySearchInputMessage?: string;
  /**
   * function that would be executed when the clear button is clicked
   */
  onClearanceHandler?: () => void;
  /**
   * Text to show when search field has content
   */
  onClearanceText?: string;
}

function SearchField({
  className = "",
  emptySearchInputMessage = "Enter search term",
  onClearanceHandler,
  onClearanceText,
  leftIcon = undefined,
  ...otherProps
}: SearchFieldProps) {
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
            data-test-id={
              otherProps["data-test-id"] &&
              `${otherProps["data-test-id"]}-clear-btn`
            }
            name="operation-clear"
            text={
              onClearanceText ? onClearanceText : "Clear current search term"
            }
            onClick={onClearanceHandler}
          />
        ) : undefined
      }
      {...otherProps}
      type={"search"}
      leftIcon={leftIcon}
      round={true}
    />
  );
}

export default SearchField;
