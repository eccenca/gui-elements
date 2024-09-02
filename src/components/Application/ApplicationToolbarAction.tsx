import React from "react";
import { HeaderGlobalAction as CarbonHeaderGlobalAction } from "@carbon/react";

// import { HeaderGlobalActionProps as CarbonHeaderGlobalActionProps } from "@carbon/react/es/components/UIShell/HeaderGlobalAction"; // TODO: check later again, currently interface is not exported
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

// workaround to get type/interface
type CarbonHeaderGlobalActionProps = React.ComponentProps<typeof CarbonHeaderGlobalAction>;
export type ApplicationToolbarActionProps = CarbonHeaderGlobalActionProps;

export const ApplicationToolbarAction = ({
    children,
    className = "",
    ...otherCarbonHeaderGlobalActionProps
}: ApplicationToolbarActionProps) => {
    return (
        <CarbonHeaderGlobalAction
            {...otherCarbonHeaderGlobalActionProps}
            className={`${eccgui}-application__toolbar__action ` + className}
        >
            {children}
        </CarbonHeaderGlobalAction>
    );
};

export default ApplicationToolbarAction;
