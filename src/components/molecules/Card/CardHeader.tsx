import React from "react";

import { cn } from "@/common/utils/cn";
import { OverviewItemDescription } from "@/components/molecules/OverviewItem";
import OverviewItem, { OverviewItemProps } from "@/components/molecules/OverviewItem/OverviewItem";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

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
                    // `content-box` mirrors the original explicit override of the app-wide `border-box` reset,
                    // so the wrapped dense `OverviewItem` (min-h-8, ~32px) stays the content box and the padding
                    // below sits around it; shrink-0/grow-0 mirror the flex-item behavior within Card's column layout
                    "box-content shrink-0 grow-0",
                    // medium (default) padding, symmetric
                    "px-4 py-3",
                    // whitespaceAmount tiers cascade down from the ancestor `Card` root, which is the only
                    // place that knows the value (see `Card.tsx`) - literal ancestor class names below are
                    // required (not `${eccgui}-...` interpolation) so Tailwind's static scanner can see them.
                    "[.eccgui-card--whitespace-none_&]:p-0",
                    "[.eccgui-card--whitespace-small_&]:px-2 [.eccgui-card--whitespace-small_&]:py-1.5",
                    "[.eccgui-card--whitespace-large_&]:px-6 [.eccgui-card--whitespace-large_&]:py-4",
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
