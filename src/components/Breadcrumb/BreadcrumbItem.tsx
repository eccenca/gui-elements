import React from "react";
// import PropTypes from 'prop-types';
import {
    Breadcrumb as BlueprintBreadcrumbItem,
    BreadcrumbProps as BlueprintBreadcrumbItemProps,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { openInNewTab } from "../../common/utils/openInNewTab";

// FIXME: enforce href and remove onClick later
export type BreadcrumbItemProps = Omit<
    BlueprintBreadcrumbItemProps,
    // we remove some properties that are currently not necessary, required usage should be discussed
    "icon" |
    "iconTitle" |
    "intent" |
    "target"
>;

/**
 * Item of the breadcrumbs list.
 * It cannot be used directly but the properties can be used within the elements of the `BreadcrumbList.items` property.
 */
function BreadcrumbItem({
    className = "",
    onClick,
    href,
    //itemDivider='',
    ...otherBlueprintBreadcrumbProps
}: BreadcrumbItemProps) {

    /*
        FIXME: adding `data-divider` does not work this way because BlueprintJS
        breadcrumb component does not support (and forward) it on HTML element
        level. The idea is to add the divider as data-* property to use it via
        CSS/Sass as content for the pseudo element, currently done static in CSS
        with slash char.
    */
    return (
      <BlueprintBreadcrumbItem
        {...otherBlueprintBreadcrumbProps}
        href={href}
        onClick={(e) => openInNewTab(e, onClick, href)}
        className={`${eccgui}-breadcrumb__item ` + className}
        /* data-divider={itemDivider ? itemDivider : ''} */
      />
    );
}

export default BreadcrumbItem;
