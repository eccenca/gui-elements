import React from 'react';
import {
    Popover as BlueprintPropover,
    IPopoverProps as BlueprintPopoverProps,
    Position as BlueprintPosition,
} from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface ContextOverlayProps extends BlueprintPopoverProps {
    /**
     * Alternate way to connect elements.
     * First child is used as `target`, everything ales as `content` displayed after iteracting with the `target` element.
     */
    children?: React.ReactNode | React.ReactNode[];
}

/**
 * Element displays connected content by interacting with a target element.
 */
function ContextOverlay({
    children,
    className='',
    ...restProps
}: ContextOverlayProps) {

    return (
        <BlueprintPropover
            position={BlueprintPosition.BOTTOM}
            {...restProps}
            className={`${eccgui}-contextoverlay ` + className}
        >
            {children}
        </BlueprintPropover>
    )
}

export default ContextOverlay;
