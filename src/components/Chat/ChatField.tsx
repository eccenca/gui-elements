import React from "react";

import { TestableComponent } from "../../components/interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { IconButton } from "../Icon/IconButton";
import { TextArea, TextAreaProps } from "../TextField/TextArea";

export interface ChatFieldProps extends TextAreaProps, TestableComponent {
    /**
     * Default input to start with.
     */
    children?: string;
    /**
     * Callback handler to process the input of the field when `Enter` is pressed or the submit button is clicked.
     * If you use it together with your own handlers for `onChange` and `onKeyDown` it won't work properly.
     */
    onTextSubmit?: (value: string) => void;
}

/**
 * Component to input chat text.
 * Based on `TextArea` component.
 */
export const ChatField = ({ className, onTextSubmit, rightElement, ...otherTextAreaProps }: ChatFieldProps) => {
    const chatvalue = React.useRef<string>(otherTextAreaProps.children ?? "");

    const onContentChange = (value: string) => {
        chatvalue.current = value;
    };

    const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.keyCode === 13 && e.shiftKey === false && onTextSubmit) {
            e.preventDefault();
            onTextSubmit(chatvalue.current);
        }
    };

    return (
        <TextArea
            fill
            autoResize
            className={`${eccgui}-chat__inputfield` + (className ? ` ${className}` : "")}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                onContentChange(e.target.value);
            }}
            onKeyDown={onTextSubmit ? onEnter : undefined}
            rightElement={
                (onTextSubmit || rightElement) && (
                    <>
                        {onTextSubmit && (
                            <IconButton name={"operation-send"} onClick={() => onTextSubmit(chatvalue.current)} />
                        )}
                        {rightElement}
                    </>
                )
            }
            {...otherTextAreaProps}
        />
    );
};

export default ChatField;
