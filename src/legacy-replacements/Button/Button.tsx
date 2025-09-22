import React from "react";

import Button from "../../components/Button/Button";

export const iconMappings: { [key: string]: any } = {
    edit: "item-edit",
    delete: "item-remove",
    expand_more: "toggler-showmore",
    expand_less: "toggler-showless",
    arrow_nextpage: "navigation-forth",
    arrow_back: "navigation-back",
};

/** @deprecated (v25) all legacy component support will be removed, switch to `<Button />` */
export function ButtonReplacement({
    children,
    className,
    fabSize,
    iconName,
    tooltip,
    progress,
    disabled = false,
    affirmative = false,
    dismissive = true,
    disruptive = false,
    raised = false,
    colored = false,
    ...otherProps
}: any) {
    if (process.env.NODE_ENV === "development") {
        const debugMsg = [
            "This button element is a adhoc replacement for a legacy element. Usage is deprecated, please use a standard element (Button).",
        ];
        if (typeof otherProps.accent !== "undefined") {
            debugMsg.push("Button 'accent' property is not supported on legacy replacement element.");
            delete otherProps.accent;
        }
        if (typeof otherProps.badge !== "undefined") {
            debugMsg.push("Button 'badge' property is not supported on legacy replacement element.");
            delete otherProps.badge;
        }
        if (typeof otherProps.ripple !== "undefined") {
            debugMsg.push("Button 'ripple' property is not supported on legacy replacement element.");
            delete otherProps.ripple;
        }
        if (typeof progress !== "undefined") {
            debugMsg.push(
                "Button 'progress' property is not fully supported on legacy replacement element, it only shows a loading spinner in the button."
            );
        }
        // eslint-disable-next-line no-console
        debugMsg.forEach((element) => console.debug(element));
    }
    if (typeof otherProps.accent !== "undefined") {
        delete otherProps.accent;
    }
    if (typeof otherProps.badge !== "undefined") {
        delete otherProps.badge;
    }
    if (typeof otherProps.ripple !== "undefined") {
        delete otherProps.ripple;
    }
    return (
        <Button
            {...otherProps}
            className={className}
            minimal={!!iconName && raised === false ? true : false}
            icon={iconName ? (iconName && iconMappings[iconName] ? iconMappings[iconName] : iconName) : undefined}
            tooltip={tooltip ? tooltip : false}
            disabled={disabled}
            affirmative={affirmative}
            disruptive={disruptive}
            intent={(!!fabSize || colored || !dismissive) ? "primary" : undefined}
            large={!!fabSize && fabSize !== "mini"}
            loading={progress ? true : false}
        >
            {children}
        </Button>
    );
}
