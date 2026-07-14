import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import PropertyName from "./PropertyName";
import PropertyValue from "./PropertyValue";

// The label column width used to live on the `PropertyName` cell (`--small`/`--large`); a CSS grid
// template has to sit on the container instead, so we read the child `PropertyName`'s `size` here and
// pick the matching column ratio (label / value out of 16, mirroring the former float widths).
const gridTemplateBySize: Record<"small" | "medium" | "large", string> = {
    small: "grid-cols-[minmax(0,2fr)_minmax(0,14fr)]",
    medium: "grid-cols-[minmax(0,3fr)_minmax(0,13fr)]",
    large: "grid-cols-[minmax(0,5fr)_minmax(0,11fr)]",
};

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
              const originalChild = child as React.ReactElement<{ nowrap?: boolean }>;
              if (originalChild.type && (originalChild.type === PropertyName || originalChild.type === PropertyValue)) {
                  return React.cloneElement(originalChild, { nowrap: true });
              }
              return child;
          })
        : children;

    let labelSize: "small" | "medium" | "large" = "medium";
    React.Children.forEach(children, (child) => {
        const originalChild = child as React.ReactElement<{ size?: "small" | "medium" | "large" }>;
        if (originalChild && originalChild.type === PropertyName && originalChild.props?.size) {
            labelSize = originalChild.props.size;
        }
    });

    return (
        <div
            className={cn(
                "w-full [&_.eccgui-label]:text-inherit",
                // regular layout: two-column grid (label | value). `col-start` keeps multiple values
                // stacked under each other in the value column (the former float behaviour); a
                // `min-h` floor per cell replaces the old `min-height: <textfield-height>`.
                !singleColumn && "grid items-stretch gap-x-4 [&>dt]:col-start-1 [&>dd]:col-start-2 [&>*]:min-h-8",
                !singleColumn && gridTemplateBySize[labelSize],
                // divider / spacing between pairs and, for multi-value pairs, between consecutive values
                // (`[&>dd:not(:last-child)]`). 0.5 * block-whitespace ≈ 7px.
                hasDivider &&
                    "[&:not(:last-child)]:border-b [&:not(:last-child)]:border-border [&>dd:not(:last-child)]:border-b [&>dd:not(:last-child)]:border-border",
                hasSpacing &&
                    "[&:not(:first-child)]:mt-[7px] [&:not(:last-child)]:mb-[7px] [&:not(:last-child)]:pb-[7px] [&>dd:not(:last-child)]:mb-[7px] [&>dd:not(:last-child)]:pb-[7px]",
                // frozen `eccgui-*` classname contract
                `${eccgui}-propertyvalue__pair`,
                hasSpacing && `${eccgui}-propertyvalue__pair--hasspacing`,
                hasDivider && `${eccgui}-propertyvalue__pair--hasdivider`,
                singleColumn && `${eccgui}-propertyvalue__pair--singlecolumn`,
                className
            )}
            {...otherProps}
        >
            {alteredChildren}
        </div>
    );
};

export default PropertyValuePair;
