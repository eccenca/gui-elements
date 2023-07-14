import React from "react";
import {
    HeaderPanel as CarbonHeaderPanel,
    HeaderPanelProps as CarbonHeaderPanelProps,
} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ApplicationToolbarPanelProps extends CarbonHeaderPanelProps {
    /**
     * Event handler getting called when the pointer device leaves the area of the panel menu.
     * Could be used to close it automatically.
     */
    onLeave?: () => void;
    /**
     * Event handler getting called when the the user clicks outside of the panel menu area.
     */
    onOutsideClick?: () => void;
};

export const ApplicationToolbarPanel = ({
    children,
    className = "",
    onLeave,
    onOutsideClick,
    ...otherCarbonHeaderPanelProps
}: ApplicationToolbarPanelProps) => {

    const panel = (
        <CarbonHeaderPanel
            {...otherCarbonHeaderPanelProps}
            className={`${eccgui}-application__toolbar__panel ` + className}
        >
            { children }
        </CarbonHeaderPanel>
    );

    return (onLeave || onOutsideClick) ? (
        <>
            <div
                className={
                    (onLeave ? `${eccgui}-application__toolbar__panel-backdrop--onleave` : "") +
                    (onOutsideClick ? `${eccgui}-application__toolbar__panel-backdrop--onoutsideclick` : "")
                }
                onClick={onOutsideClick}
                onPointerEnter={onLeave}
            />
            {panel}
        </>
    ) : panel;
}

export default ApplicationToolbarPanel;
