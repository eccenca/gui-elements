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
import { ReacFlowVersionSupportProps } from "../versionsupport";

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
    flowVersion = "legacy",
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

    return flowVersion === "legacy" ? (
        <HandleLegacy {...handleProps} {...tooltipTitle}>
            { handleContent }
        </HandleLegacy>
    ) : (
        <HandleNext {...handleProps} {...tooltipTitle}>
            { handleContent }
        </HandleNext>
    );
});
