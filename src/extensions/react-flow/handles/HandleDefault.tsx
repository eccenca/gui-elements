import React, {memo} from 'react';
import {
    HandleProps as ReactFlowHandleLegacyProps,
    Handle as HandleLegacy,
} from "react-flow-renderer";
import {
    HandleProps as ReactFlowHandleNextProps,
    Handle as HandleNext,
} from "react-flow-renderer-lts";
import { HandleContent, HandleContentProps } from "./HandleContent";
import { ReacFlowVersionSupportProps, useReactFlowVersion } from "../versionsupport";

interface HandleExtensionProps extends ReacFlowVersionSupportProps {
    data?: HandleContentProps;
    tooltip?: string;
    children?: JSX.Element | string;
    onClick?: () => void;
}

export interface HandleProps extends HandleExtensionProps, ReactFlowHandleLegacyProps {
}

export interface HandleNextProps extends HandleExtensionProps, ReactFlowHandleNextProps {
}

export const HandleDefault = memo(({
    flowVersion = useReactFlowVersion(),
    data,
    tooltip,
    children,
    ...handleProps
}: HandleProps | HandleNextProps) => {
    const tooltipTitle = !!tooltip ? { title: tooltip } : {};

    const handleContent = (
        <HandleContent {...data}>
            { children }
        </HandleContent>
    );

    switch (flowVersion) {
        case "legacy":
            return (
                <HandleLegacy {...handleProps} {...tooltipTitle}>
                    { handleContent }
                </HandleLegacy>
            );
        case "next":
            return (
                <HandleNext {...handleProps} {...tooltipTitle}>
                    { handleContent }
                </HandleNext>
            );
        default:
            return <></>;
    }
});
