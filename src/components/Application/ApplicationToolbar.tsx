import React from "react";
import { HeaderGlobalBar as CarbonHeaderGlobalBar } from "@carbon/react";

// import { HeaderGlobalBarProps as CarbonHeaderGlobalBarProps } from "@carbon/react/es/components/UIShell/HeaderGlobalBar"; // TODO: check later again, currently interface is not exported
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

// workaround to get type/inteface
type CarbonHeaderGlobalBarProps = React.ComponentProps<typeof CarbonHeaderGlobalBar>;
export type ApplicationToolbarProps = CarbonHeaderGlobalBarProps;

export const ApplicationToolbar = ({
    children,
    className = "",
    ...otherCarbonHeaderGlobalBarProps
}: ApplicationToolbarProps) => {
    return (
        <CarbonHeaderGlobalBar
            {...otherCarbonHeaderGlobalBarProps}
            className={`${eccgui}-application__toolbar ` + className}
        >
            {children}
        </CarbonHeaderGlobalBar>
    );
};

export default ApplicationToolbar;
