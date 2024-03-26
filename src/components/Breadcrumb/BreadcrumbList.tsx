import React, { useCallback } from "react";
import {
    Breadcrumbs as BlueprintBreadcrumbList,
    BreadcrumbsProps as BlueprintBreadcrumbsProps,
} from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import BreadcrumbItem from "./BreadcrumbItem";
import { BreadcrumbItemProps } from "./BreadcrumbItem";

export interface BreadcrumbListProps
    extends Omit<
        BlueprintBreadcrumbsProps,
        // we remove some properties that are currently not necessary, required usage should be discussed
        | "breadcrumbRenderer"
        | "collapseFrom"
        | "currentBreadcrumbRenderer"
        | "minVisibleItems"
        | "overflowListProps"
        | "popoverProps"
    > {
    /**
        list of breadcrumb items to display
    */
    items: BreadcrumbItemProps[];
    /**
        Click handler used on all breadcrumb items using their `href` property.
        Is only used if the breadcrumb item have not defined an own `onClick` handler.
    */
    onItemClick?(itemUrl: string | undefined, event: object): boolean | void;
    /**
        native attributes for the unordered HTML list (ul)
    */
    htmlUlProps?: React.HTMLAttributes<HTMLUListElement>;
    /**
        char that devides breadcrumb items, default: "/" (currently unsupported)
    */
    //itemDivider?: never;
    /**
     * Do not re-render breadcrumbs in a shortened version if they overflow the available space.
     */
    ignoreOverflow?: boolean;
    /**
     * If set to `true` then breadcrumb items can shrink.
     * This way we cannot prevent overflowing breadcrumbs completely but this happens very late.
     * You should enable this when `ignoreOverflow` is `true`.
     */
    latenOverflow?: boolean;
}

/**
 * Navigation path to the currently show resource or view in the application.
 */
export const BreadcrumbList = ({
    className = "",
    // itemDivider = "/",
    onItemClick,
    htmlUlProps,
    ignoreOverflow = false,
    latenOverflow = false,
    ...otherBlueprintBreadcrumbsProps
}: BreadcrumbListProps) => {
    const renderBreadcrumb = useCallback(
        (propsBreadcrumb: BreadcrumbItemProps) => {
            const { onClick, ...otherProps } = propsBreadcrumb;
            return (
                <BreadcrumbItem
                    /*itemDivider="/"*/
                    {...otherProps}
                    onClick={
                        onItemClick && propsBreadcrumb.href && !onClick
                            ? (e) => {
                                  onItemClick(propsBreadcrumb.href, e);
                              }
                            : onClick
                    }
                />
            );
        },
        [onItemClick]
    );

    const renderCurrentBreadcrumb = React.useCallback((propsBreadcrumb: BreadcrumbItemProps) => {
        return <BreadcrumbItem {...propsBreadcrumb} current={true} /*itemDivider={itemDivider}*/ />;
    }, []);

    const overflowListProps = React.useMemo(
        () =>
            ignoreOverflow
                ? {
                      minVisibleItems: otherBlueprintBreadcrumbsProps.items.length,
                  }
                : {},
        [ignoreOverflow, otherBlueprintBreadcrumbsProps.items.length]
    );

    return (
        <BlueprintBreadcrumbList
            {...otherBlueprintBreadcrumbsProps}
            {...htmlUlProps}
            className={
                `${eccgui}-breadcrumb__list` +
                (latenOverflow ? ` ${eccgui}-breadcrumb__list--latenoverflow` : "") +
                (className ? ` ${className}` : "")
            }
            minVisibleItems={1}
            breadcrumbRenderer={renderBreadcrumb}
            currentBreadcrumbRenderer={renderCurrentBreadcrumb}
            overflowListProps={overflowListProps}
        />
    );
};

export default BreadcrumbList;
