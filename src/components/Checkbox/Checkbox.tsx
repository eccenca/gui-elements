import React from 'react';
import { Checkbox as BlueprintCheckbox } from "@blueprintjs/core";

interface ICheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    children?: any;
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        checkbox will display checked
    */
    checked?: boolean;
    /**
        checkbox is unusable and non-interactive
    */
    disabled?: boolean;
    /**
        checkbox text label for the control, use `children` or `labelElement` to supply JSX content when used together with TypeScript
     */
    label?: string;
    labelElement?: JSX.Element | string; // workaround for TypeScript consumers
    /**
        checkbox will display with styles making it visually larger
    */
    large?: boolean;
    /**
        event handler invoked when input value is changed
    */
    onChange?: React.FormEventHandler<HTMLInputElement>;
    /**
        name of the HTML tag that wraps the checkbox, default: "label"
    */
    tagName?: keyof JSX.IntrinsicElements;
    // take out properties from usage
    alignIndicator?: never;
    defaultChecked?: never;
    inputRef?: never;
    inline?: never;
}

function Checkbox({
    children,
    className='',
    ...restProps
}: ICheckboxProps) {
    return (
        <BlueprintCheckbox
            {...restProps}
            className={'ecc-checkbox '+className}
        >
            {children}
        </BlueprintCheckbox>
    );
};

export default Checkbox;
