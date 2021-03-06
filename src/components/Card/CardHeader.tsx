import React from "react";
import { OverviewItem, OverviewItemDescription } from "./../OverviewItem";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import CardTitle from "./CardTitle";
import CardOptions from "./CardOptions";

function CardHeader({ children, className = "", densityHigh = true, ...otherProps }: any) {
    let actions: any[] = [];
    let description: any[] = [];

    React.Children.map(children, (child, i) => {
        if (child) {
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
