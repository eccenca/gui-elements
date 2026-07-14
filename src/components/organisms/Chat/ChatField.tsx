import React from "react";

import { cn } from "@/common/utils/cn";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { IconButton } from "@/components/atoms/Icon/IconButton";
import { TextArea, TextAreaProps } from "@/components/atoms/TextField/TextArea";

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
export const ChatField = ({
    className,
    onTextSubmit,
    onChange,
    onKeyDown,
    rightElement,
    ...otherTextAreaProps
}: ChatFieldProps) => {
    const chatvalue = React.useRef<string>(otherTextAreaProps.children ?? "");

    const onContentChange = (value: string) => {
        chatvalue.current = value;
    };

    const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (onKeyDown) onKeyDown(e);
        if (e.keyCode === 13 && e.shiftKey === false && onTextSubmit) {
            e.preventDefault();
            onTextSubmit(chatvalue.current);
        }
    };

    return (
        <TextArea
            fill
            autoResize
            className={cn("max-h-[39vh] min-h-18 resize-none", `${eccgui}-chat__inputfield`, className)}
            onChange={
                onTextSubmit
                    ? (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          onContentChange(e.target.value);
                          if (onChange) onChange(e);
                      }
                    : onChange
            }
            onKeyDown={onTextSubmit ? onEnter : onKeyDown}
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
