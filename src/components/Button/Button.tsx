import React from "react";
import {
    AnchorButton as BlueprintAnchorButton,
    Button as BlueprintButton,
    Intent as BlueprintIntent,
} from "@blueprintjs/core";
import * as IntentDefinitions from "../Intent/definitions";
import Icon from "../Icon/Icon";

interface IButtonProps {
    children?: any;
    /**
        button label, can be a string or an element, you can use it instead of adding children elements
    */
    text?: JSX.Element | string;
    href?: string;
    /**
        input button type, one of `"button"`, `"submit"`, and `"reset"`,
        it has no effect on buttons used with href
     */
    type?: "submit" | "reset" | "button";
    /**
        adding visuals to mark the button leads to a affirmative action, default: false
    */
    affirmative?: boolean;
    /**
        adding visuals to mark the button leads to a disruptive action, default: false
    */
    disruptive?: boolean;
    /**
        adding visuals to make the button stood out compared to regular buttons, default: false
    */
    elevated?: boolean;
    /**
        button will display a centered loading spinner instead of its contents
        without getting affected in its size
    */
    loading?: boolean;
    /**
        button will display in an active state
    */
    active?: boolean;
    /**
        button is not usable and non-interactive
    */
    disabled?: boolean;
    /**
        button will display larger than regular buttons
    */
    large?: boolean;
    /**
        button will display smaller than regular buttons
    */
    small?: boolean;
    /**
        button will display using outlined styles
    */
    outlined?: boolean;
    /**
        button will display using minimal styles,
        visually narrowed compared to regular buttons
    */
    minimal?: boolean;
    /**
        button will display regarding the intent, one of "regular" (default), "primary", "success", "warning" and "danger"
    */
    intent?: typeof IntentDefinitions.REGULAR | typeof IntentDefinitions.PRIMARY | typeof IntentDefinitions.SUCCESS | typeof IntentDefinitions.WARNING | typeof IntentDefinitions.DANGER;
    /**
        canonical icon name or an icon element to render before the button label
    */
    icon?: JSX.Element | string | false | null | undefined;
    /**
        canonical icon name or an icon element to render after the button label
    */
    rightIcon?: JSX.Element | string | false | null | undefined;
    // depracated
    /**
        @depracated
        button will display using styles of a primary intent of action, default: false
    */
    hasStatePrimary?: boolean;
    /**
        @depracated
        button will display using styles of a success intent of action, default: false
    */
    hasStateSuccess?: boolean;
    /**
        @depracated
        button will display using styles of a warning intent of action, default: false
    */
    hasStateWarning?: boolean;
    /**
        @depracated
        button will display using styles of a danger intent of action, default: false
    */
    hasStateDanger?: boolean;
    // take some properties out
    alignText?: never;
    fill?: never;
    // allow other properties
    [otherProps: string]: any;
}

function Button({
    children,
    className = "",
    affirmative = false,
    disruptive = false,
    elevated = false,
    intent = IntentDefinitions.REGULAR,
    hasStatePrimary = false,
    hasStateSuccess = false,
    hasStateWarning = false,
    hasStateDanger = false,
    icon = false,
    rightIcon = false,
    ...restProps
}: IButtonProps) {
    let intention = null;
    switch (true) {
        case affirmative || elevated || hasStatePrimary || (intent === IntentDefinitions.PRIMARY):
            intention = BlueprintIntent.PRIMARY;
            break;
        case hasStateSuccess || (intent === IntentDefinitions.SUCCESS):
            intention = BlueprintIntent.SUCCESS;
            break;
        case hasStateWarning || (intent === IntentDefinitions.WARNING):
            intention = BlueprintIntent.WARNING;
            break;
        case disruptive || hasStateDanger || (intent === IntentDefinitions.DANGER):
            intention = BlueprintIntent.DANGER;
            break;
        default:
            break;
    }

    let ButtonType = restProps.href ? BlueprintAnchorButton : BlueprintButton;

    return (
        <ButtonType
            {...restProps}
            className={"ecc-button " + className}
            intent={intention}
            icon={typeof icon === "string" ? <Icon name={icon} /> : icon}
            rightIcon={typeof rightIcon === "string" ? <Icon name={rightIcon} /> : rightIcon}
        >
            {children}
        </ButtonType>
    );
}

export default Button;
