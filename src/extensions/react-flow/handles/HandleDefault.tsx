import React, { memo } from "react";
import { Handle as HandleLegacy, HandleProps as ReactFlowHandleLegacyProps } from "react-flow-renderer";
import { Handle as HandleNext, HandleProps as ReactFlowHandleNextProps } from "react-flow-renderer-lts";
import { PopoverInteractionKind as BlueprintPopoverInteractionKind } from "@blueprintjs/core";

import { ReacFlowVersionSupportProps, useReactFlowVersion } from "../versionsupport";

import { HandleContent, HandleContentProps } from "./HandleContent";
import { HandleTools } from "./HandleTools";

interface HandleExtensionProps extends ReacFlowVersionSupportProps {
    /**
     * Defines the handle category, mainly used to adjust layout.
     */
    category?: "configuration" | "flexible" | "fixed" | "unknown" | "dependency";
    /**
     * Extended handle data.
     */
    data?: HandleContentProps;
    /**
     * Simple text tooltip displayed as title on hover.
     */
    tooltip?: string;
    children?: JSX.Element | string;
    onClick?: () => void;
}

export interface HandleProps extends HandleExtensionProps, ReactFlowHandleLegacyProps {}
export interface HandleNextProps extends HandleExtensionProps, ReactFlowHandleNextProps {}

export type HandleDefaultProps = HandleProps | HandleNextProps;

export const HandleDefault = memo(
    ({ flowVersion, data, tooltip, children, category, ...handleProps }: HandleDefaultProps) => {
        const evaluateFlowVersion = useReactFlowVersion();
        const flowVersionCheck = flowVersion || evaluateFlowVersion;
        const [toolsDisplayed, setToolsDisplayed] = React.useState<boolean>(false);

        const handleClosing = () => {
            setToolsDisplayed(false);
        };

        const tooltipTitle = tooltip ? { title: tooltip } : {};
        const configToolsOn = {
            defaultIsOpen: true,
            autoFocus: true,
            interactionKind: BlueprintPopoverInteractionKind.HOVER,
            onClosing: handleClosing,
        };

        const isToolsContent = children && typeof children !== "string" && children.type === HandleTools;
        let handleContent = <HandleContent {...data}>{children}</HandleContent>;

        if (isToolsContent && toolsDisplayed) {
            handleContent = (
                <HandleContent {...data}>{React.cloneElement(children ?? <></>, configToolsOn)}</HandleContent>
            );
        }
        if (isToolsContent && !toolsDisplayed) {
            handleContent = <HandleContent {...data}></HandleContent>;
        }
        const handleClick = React.useCallback(() => setToolsDisplayed(!toolsDisplayed), []);

        const handleConfig = {
            ...handleProps,
            ...tooltipTitle,
            className: isToolsContent ? "clickable" : undefined,
            onClick: isToolsContent ? handleClick : undefined,
            "data-category": category,
        };

        switch (flowVersionCheck) {
            case "legacy":
                return <HandleLegacy {...handleConfig}>{handleContent}</HandleLegacy>;
            case "next":
                return <HandleNext {...handleConfig}>{handleContent}</HandleNext>;
            default:
                return <></>;
        }
    }
);
