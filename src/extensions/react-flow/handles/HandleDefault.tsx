import React, {memo} from 'react';
import {
    HandleProps as ReactFlowHandleProps,
    Handle,
} from "react-flow-renderer";
import { HandleContent, HandleContentProps } from "./HandleContent";

export interface HandleProps extends ReactFlowHandleProps {
    data?: HandleContentProps;
    tooltip?: string;
    children?: string | React.ReactNode;
}

export const HandleDefault = memo(({
    data,
    tooltip,
    children,
    ...handleProps
}: HandleProps) => {
    const tooltipTitle = !!tooltip ? { title: tooltip } : {};

    return (
        <Handle {...handleProps} {...tooltipTitle}>
            <HandleContent {...data}>
                { children }
            </HandleContent>
        </Handle>
    );
});
