import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import PropertyName from "./PropertyName";
import PropertyValue from "./PropertyValue";

export interface PropertyValuePairProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Add a bit white space to the bottom of the element.
     */
    hasSpacing?: boolean;
    /**
     * Add a horizontal rule to the bottom of the element.
     */
    hasDivider?: boolean;
    /**
     * Forward the `nowrap` option to it `PropertyName` and `PropertyValue` children.
     */
    nowrap?: boolean;
    /**
     * Only use one single column and put property label and value below each other.
     */
    singleColumn?: boolean;
}

export const PropertyValuePair = ({
    children,
    className = "",
    nowrap,
    hasSpacing = false,
    hasDivider = false,
    singleColumn = false,
    ...otherProps
}: PropertyValuePairProps) => {
    const alteredChildren = nowrap
        ? React.Children.map(children, (child) => {
              const originalChild = child as React.ReactElement;
              if (originalChild.type && (originalChild.type === PropertyName || originalChild.type === PropertyValue)) {
                  return React.cloneElement(originalChild, { nowrap: true });
              }
              return child;
          })
        : children;

    return (
        <div
            className={
                `${eccgui}-propertyvalue__pair` +
                (className ? " " + className : "") +
                (hasSpacing ? ` ${eccgui}-propertyvalue__pair--hasspacing` : "") +
                (hasDivider ? ` ${eccgui}-propertyvalue__pair--hasdivider` : "") +
                (singleColumn ? ` ${eccgui}-propertyvalue__pair--singlecolumn` : "")
            }
            {...otherProps}
        >
            {alteredChildren}
        </div>
    );
};

export default PropertyValuePair;
