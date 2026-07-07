import React from "react";

import { cn } from "../../common/utils/cn";
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
            <OverviewItem
                {...otherProps}
                className={cn(
                    `${eccgui}-card__header`,
                    // `content-box` mirrors the original explicit override of the app-wide `border-box` reset;
                    // shrink-0/grow-0 mirror the original flex-item behavior within Card's column layout
                    "box-content shrink-0 grow-0",
                    // medium (default) padding, asymmetric: half-unit on 3 sides, full-unit on the left
                    "py-2 pr-2 pl-4",
                    // whitespaceAmount tiers cascade down from the ancestor `Card` root, which is the only
                    // place that knows the value (see `Card.tsx`) - literal ancestor class names below are
                    // required (not `${eccgui}-...` interpolation) so Tailwind's static scanner can see them.
                    "[.eccgui-card--whitespace-none_&]:p-0",
                    "[.eccgui-card--whitespace-small_&]:py-1 [.eccgui-card--whitespace-small_&]:pr-1 [.eccgui-card--whitespace-small_&]:pl-2",
                    "[.eccgui-card--whitespace-large_&]:py-4 [.eccgui-card--whitespace-large_&]:pr-4 [.eccgui-card--whitespace-large_&]:pl-8",
                    className,
                )}
                densityHigh={true}
            >
                {description.length > 0 && <OverviewItemDescription>{description}</OverviewItemDescription>}
                {actions}
            </OverviewItem>
        </header>
    );
};

export default CardHeader;
