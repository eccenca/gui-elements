import React from "react";

import { TestableComponent } from "../../components/interfaces";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { IconButton } from "../Icon/IconButton";
import { TextArea, TextAreaProps } from "../TextField/TextArea";

export interface ChatFieldProps extends Pick<TextAreaProps, "className">, TestableComponent {
    /**
     * Default input to start with.
     */
    children?: string;
    /**
     * Callback handler to process the input of the field when `Enter` is pressed or the submit button is clicked.
     */
    onSubmit: (value: string) => void;
}

/**
 * Component to input chat text.
 * Based on `TextArea` component.
 */
export const ChatField = ({ className, onSubmit, ...otherTextAreaProps }: ChatFieldProps) => {
    const chatvalue = React.useRef<string>(otherTextAreaProps.children ?? "");

    const onContentChange = (value: string) => {
        chatvalue.current = value;
    };

    const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            onSubmit(chatvalue.current);
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
            onKeyDown={onEnter}
            rightElement={<IconButton name={"navigation-forth"} onClick={() => onSubmit(chatvalue.current)} />}
            {...otherTextAreaProps}
        />
    );
};

export default ChatField;
