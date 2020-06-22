import React from 'react';
import {
    Popover as BlueprintPropover,
    IPopoverProps as IBlueprintPropoverProps,
    Position as BlueprintPosition
} from "@blueprintjs/core";

/*
    @see https://blueprintjs.com/docs/#core/components/popover for list of
    properties
*/

interface IContextOverlayProps extends IBlueprintPropoverProps {
    children?: any;
}

function ContextOverlay({
    children,
    className='',
    ...restProps
}: IContextOverlayProps) {

    return (
        <BlueprintPropover
            position={BlueprintPosition.BOTTOM}
            {...restProps}
            className={'ecc-contextoverlay ' + className}
        >
            {children}
        </BlueprintPropover>
    )
}

export default ContextOverlay;
