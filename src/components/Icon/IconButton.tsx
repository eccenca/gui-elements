import React from "react";
import Button, { ButtonProps, AnchorOrButtonProps } from "../Button/Button";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import Icon from "./Icon";
import {ValidIconName} from "./canonicalIconNames";

interface IconButtonProps extends ButtonProps {
    // Canonical icon name
    name: ValidIconName | string[]
    className?: string
    // Tooltip text
    text?: string,
    // Time after tooltip text is visible when icon is hovered/focuses
    tooltipOpenDelay?: number,
    // Display large icon version
    large?: boolean,
    // Display small icon version
    small?: boolean
    // If the tooltip should be set as title attribute instead of the Tooltip component. If true, all other tooltip parameters are ignored.
    tooltipAsTitle?: boolean
    // If set, button will become an anchor button. FIXME: CMEM-3742: Setting this parameter should not change the type of the button. Split into several components.
    href?: string
    // Additional description of the icon function to improve accessibility, if not defined then the text label is used as fallback
    description?: string
}

/** A button with an icon instead of text. */
function IconButton({
    className = "",
    name = "undefined",
    text,
    tooltipProps,
    description,
    tooltipOpenDelay = 1000,
    tooltipAsTitle = false,
    ...restProps
}: IconButtonProps & AnchorOrButtonProps) {
    return (
        <Button
            title={tooltipAsTitle && text ? text : undefined}
            {...restProps}
            icon={
                <Icon
                    name={name}
                    small={restProps.small}
                    large={restProps.large}
                    tooltipText={tooltipAsTitle ? undefined : text}
                    tooltipOpenDelay={tooltipOpenDelay}
                    tooltipProps={!!tooltipProps ? tooltipProps : {}}
                    description={description ? description : text}
                />
            }
            className={`${eccgui}-button--icon ` + className}
            minimal
        />
    );
}

export default IconButton;
