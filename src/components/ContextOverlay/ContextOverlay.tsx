import React from 'react';
import { Popover as BlueprintPropover, Position as BlueprintPosition } from "@blueprintjs/core";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/*

    @see https://blueprintjs.com/docs/#core/components/popover for list of
    properties

*/

function ContextOverlay({
    children,
    className='',
    ...restProps
}: any) {

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
