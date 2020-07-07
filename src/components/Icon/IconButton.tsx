import React from "react";
import Button from "../Button/Button";
import { IButtonProps } from "../Button/Button";
import Icon from "./Icon";

interface IIconButtonProps extends IButtonProps {
    /**
        space-delimited list of class names
    */
    className?: string;
    /**
        icon name, if not know then "undefined" is used
    */
    name: string | string[]; // TODO: do we want this limited to only the canonical names so an error is thrown?
    /**
        icon description, could be used to increase accessibility
    */
    description?: string; // TODO: do we want this have mandatory?
    /**
        use large display of icon
    */
    large?: boolean;
    /**
        use small display of icon
    */
    small?: boolean;
    /**
        tooltip text, if given then a tooltip is added to the icon
    */
    tooltipText?: React.ReactNode;
    /**
        how long is the delay until the tooltip is open when the user hover an icon
    */
    tooltipOpenDelay?: number;
}

function IconButton({ className = "", name = "undefined", text, ...restProps }: IIconButtonProps) {
    return (
        <Button
            {...restProps}
            icon={
                <Icon
                    name={name}
                    small={restProps.small}
                    large={restProps.large}
                    tooltipText={text}
                    tooltipOpenDelay={1000}
                    description={restProps.description}
                />
            }
            className={"ecc-button--icon " + className}
            minimal
        />
    );
}

export default IconButton;
