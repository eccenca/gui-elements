import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type OverviewItemDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export const OverviewItemDescription = ({
    children,
    className = "",
    ...otherDivProps
}: OverviewItemDescriptionProps) => {
    return (
        <div {...otherDivProps} className={`${eccgui}-overviewitem__description ` + className}>
            {children}
        </div>
    );
};

export default OverviewItemDescription;
