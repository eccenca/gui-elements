import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import { PropertyValuePair } from "./PropertyValuePair";

export interface PropertyValueListProps extends React.HTMLAttributes<HTMLDListElement> {
    /**
     * Only use one single column and put property label and value below each other.
     * This property is forwardd to direct `PropertyValuePair` children.
     */
    singleColumn?: boolean;
}

export const PropertyValueList = ({
    className = "",
    children,
    singleColumn = false,
    ...otherProps
}: PropertyValueListProps) => {
    const alteredChildren = singleColumn
        ? React.Children.map(children, (child) => {
              const originalChild = child as React.ReactElement;
              if (originalChild && originalChild.type && originalChild.type === PropertyValuePair) {
                  return React.cloneElement(originalChild as React.ReactElement<{singleColumn: boolean}>, { singleColumn: true });
              }
              return child;
          })
        : children;

    return (
        <dl className={`${eccgui}-propertyvalue__list` + (className ? " " + className : "")} {...otherProps}>
            {alteredChildren}
        </dl>
    );
};

export default PropertyValueList;
