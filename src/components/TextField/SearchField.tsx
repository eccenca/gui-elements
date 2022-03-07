import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import IconButton from "../Icon/IconButton";
import Icon from "../Icon/Icon";
import TextField, { TextFieldProps } from "./TextField";

interface SearchFieldProps extends Omit<
    TextFieldProps,
    "placeholder | hasStatePrimary | hasStateSuccess | hasStateWarning | hasStateDanger | fullWidth"
> {
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
function SearchField({
  className = "",
  emptySearchInputMessage = "Enter search term",
  onClearanceHandler,
  onClearanceText = "Clear input",
  leftIcon = <Icon name="operation-search" />,
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
