import React from "react";
import Button from "../Button/Button";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "./Icon";

function IconButton({ className = "", name = "undefined", text, description, tooltipProperties, ...restProps }: any) {
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
                    tooltipProperties={!!tooltipProperties ? tooltipProperties : {}}
                    description={description ? description : text}
                />
            }
            className={`${eccgui}-button--icon ` + className}
            minimal
        />
    );
}

export default IconButton;
