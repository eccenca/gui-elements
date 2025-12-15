import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { OverviewItemDescription } from "./../OverviewItem";
import OverviewItem, { OverviewItemProps } from "./../OverviewItem/OverviewItem";
import CardOptions from "./CardOptions";
import CardTitle from "./CardTitle";

export interface CardHeaderProps extends Omit<OverviewItemProps, "densityHigh" | "hasSpacing"> {
    children: React.JSX.Element | (React.JSX.Element | undefined | null)[] | null | undefined;
}

export const CardHeader = ({ children, className = "", ...otherProps }: CardHeaderProps) => {
    const actions: any[] = [];
    const description: any[] = [];

    children &&
        (Array.isArray(children) ? children : [children]).forEach((child) => {
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
            <OverviewItem {...otherProps} className={`${eccgui}-card__header ` + className} densityHigh={true}>
                {description.length > 0 && <OverviewItemDescription>{description}</OverviewItemDescription>}
                {actions}
            </OverviewItem>
        </header>
    );
};

export default CardHeader;
