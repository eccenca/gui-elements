import React from "react";
import OverviewItem, { OverviewItemProps } from "./../OverviewItem/OverviewItem";
import { OverviewItemDescription } from "./../OverviewItem";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import CardTitle from "./CardTitle";
import CardOptions from "./CardOptions";

interface CardHeaderProps extends OverviewItemProps {
    children: JSX.Element | (JSX.Element | undefined | null)[] | null | undefined;
}

function CardHeader({
    children,
    className = "",
    densityHigh = true,
    ...otherProps
}: CardHeaderProps) {
    let actions: any[] = [];
    let description: any[] = [];

    children && (Array.isArray(children) ? children : [children]).forEach((child) => {
        if (typeof child === "object" && child && !!child.type) {
            switch (child.type) {
                case CardTitle:
                    description.push(child);
                    break;
                case CardOptions:
                    actions.push(child);
                    break;
            }
        }
    });

    return (
        <header>
            <OverviewItem {...otherProps} className={`${eccgui}-card__header ` + className} densityHigh={densityHigh}>
                {description.length > 0 && <OverviewItemDescription>{description}</OverviewItemDescription>}
                {actions}
            </OverviewItem>
        </header>
    );
}

export default CardHeader;
