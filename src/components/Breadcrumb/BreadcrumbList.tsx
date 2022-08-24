import React from "react";
import {
    Breadcrumbs2 as BlueprintBreadcrumbList,
    Breadcrumbs2Props as BlueprintBreadcrumbsProps,
} from "@blueprintjs/popover2";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import BreadcrumbItem from "./BreadcrumbItem";
import { BreadcrumbItemProps } from "./BreadcrumbItem";

type ReducedBreadcrumbsProps = Omit<
    BlueprintBreadcrumbsProps,
    // we remove some properties that are currently not necessary, required usage should be discussed
    "breadcrumbRenderer" |
    "collapseFrom" |
    "currentBreadcrumbRenderer" |
    "minVisibleItems" |
    "overflowListProps" |
    "popoverProps"
>;

// FIXME: enforce onItemClick later when href value can always be routed correctly
interface BreadcrumbListProps extends ReducedBreadcrumbsProps {
    /**
        list of breadcrumb items to display
    */
    items: BreadcrumbItemProps[];
    /**
        click handler used on breadcrumb items
    */
    onItemClick?(itemUrl: string, event: object): any;
    /**
        native attributes for the unordered HTML list (ul)
    */
    htmlUlProps?: React.HTMLAttributes<HTMLUListElement>;
    /**
        char that devides breadcrumb items, default: "/" (currently unsupported)
    */
    itemDivider?: never;
}

/**
 * Navigation path to the currently show resource or view in the application.
 */
function BreadcrumbList({
    className = "",
    // itemDivider = "/",
    onItemClick,
    htmlUlProps,
    ...otherBlueprintBreadcrumbsProps
}: BreadcrumbListProps) {
    const renderBreadcrumb = (propsBreadcrumb: any) => {
        const {onClick, ...otherProps} = propsBreadcrumb;
        return (
            <BreadcrumbItem
                /*itemDivider="/"*/
                {...otherProps}
                onClick={
                    onItemClick
                        ? (e) => {
                              onItemClick(propsBreadcrumb.href, e);
                          }
                        : onClick
                }
            />
        );
    };

    const renderCurrentBreadcrumb = (propsBreadcrumb: any) => {
        return <BreadcrumbItem {...propsBreadcrumb} current={true} href={null} onClick={null} /*itemDivider={itemDivider}*/ />;
    };

    return (
        <BlueprintBreadcrumbList
            {...otherBlueprintBreadcrumbsProps}
            {...htmlUlProps}
            className={`${eccgui}-breadcrumb__list ` + className}
            minVisibleItems={1}
            breadcrumbRenderer={renderBreadcrumb}
            currentBreadcrumbRenderer={renderCurrentBreadcrumb}
        />
    );
}

export default BreadcrumbList;
