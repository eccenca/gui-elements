import React from "react";
import OverviewItem, { OverviewItemProps } from "./../OverviewItem/OverviewItem";
import { OverviewItemDescription } from "./../OverviewItem";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import CardTitle from "./CardTitle";
import CardOptions from "./CardOptions";

interface CardHeaderProps extends OverviewItemProps {
    children?: any; // Fixme: workaround to prevent typescript problem with child.type
}

function CardHeader({
    children,
    className = "",
    densityHigh = true,
    ...otherProps
}: CardHeaderProps) {
    let actions: any[] = [];
    let description: any[] = [];

    React.Children.map(children, (child, i) => {
        if (typeof child === "object" && !!child && !!child.type) {
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
