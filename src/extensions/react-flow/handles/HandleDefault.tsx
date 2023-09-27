import React, { memo } from "react";
import { Handle as HandleLegacy, HandleProps as ReactFlowHandleLegacyProps } from "react-flow-renderer";
import { Handle as HandleNext, HandleProps as ReactFlowHandleNextProps } from "react-flow-renderer-lts";

import { intentClassName, IntentTypes } from "../../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { TooltipProps } from "../../../index";
import { ReacFlowVersionSupportProps, useReactFlowVersion } from "../versionsupport";

import { HandleContent, HandleContentProps } from "./HandleContent";

export type HandleCategory = "configuration" | "flexible" | "fixed" | "unknown" | "dependency"

interface HandleExtensionProps extends ReacFlowVersionSupportProps {
    /**
     * Defines the handle category, mainly used to adjust layout.
     */
    category?: HandleCategory;
    /**
     * Extended handle data.
     */
    data?: HandleContentProps;
    /**
     * Simple text tooltip displayed as title on hover.
     */
    tooltip?: string;
    /**
     * Feedback state of the handle.
     */
    intent?: IntentTypes;
    children?: HandleContentProps["children"];
    onClick?: () => void;
}

export interface HandleProps extends HandleExtensionProps, ReactFlowHandleLegacyProps {}
export interface HandleNextProps extends HandleExtensionProps, ReactFlowHandleNextProps {}

export type HandleDefaultProps = HandleProps | HandleNextProps;

export const HandleDefault = memo(
    ({ flowVersion, data, tooltip, children, category, intent, ...handleProps }: HandleDefaultProps) => {
        const evaluateFlowVersion = useReactFlowVersion();
        const flowVersionCheck = flowVersion || evaluateFlowVersion;
        const handleDefaultRef = React.useRef<any>();
        const [extendedTooltipDisplayed, setExtendedTooltipDisplayed] = React.useState<boolean>(false);
        const [handleToolsDisplayed, setHandleToolsDisplayed] = React.useState<boolean>(false);

        const routeClickToTools = React.useCallback(
            (e) => {
                const toolsTarget = handleDefaultRef.current.getElementsByClassName(
                    `${eccgui}-graphviz__handletools-target`
                );
                if (toolsTarget.length > 0 && e.target === handleDefaultRef.current) {
                    setHandleToolsDisplayed(true);
                    setExtendedTooltipDisplayed(false);
                }
            },
            [handleDefaultRef]
        );

        React.useEffect(() => {
            if (handleToolsDisplayed) {
                const toolsTarget = handleDefaultRef.current.getElementsByClassName(
                    `${eccgui}-graphviz__handletools-target`
                );
                toolsTarget[0].click();
            }
        }, [handleToolsDisplayed]);

        const tooltipTitle = tooltip ? { title: tooltip } : {};

        const handleContentTooltipProps = {
            placement:
                handleProps.position === "left" || handleProps.position === "right"
                    ? `${handleProps.position}-end`
                    : undefined,
            intent: intent,
            className: `${eccgui}-graphviz__handle__tooltip-target`,
            isOpen: extendedTooltipDisplayed && !handleToolsDisplayed,
        };

        const handleContentProps = {
            ...data,
            tooltipProps: {
                ...handleContentTooltipProps,
                ...data?.tooltipProps,
            } as TooltipProps,
        };

        const handleContent = <HandleContent {...handleContentProps}>{children}</HandleContent>;

        const handleConfig = {
            ...handleProps,
            ...tooltipTitle,
            className: intent ? ` ${intentClassName(intent)}` : "",
            onClick: routeClickToTools,
            "data-category": category,
            onMouseEnter: () => {
                setExtendedTooltipDisplayed(true);
                setHandleToolsDisplayed(false);
            },
            onMouseLeave: () => setExtendedTooltipDisplayed(false),
        };

        switch (flowVersionCheck) {
            case "legacy":
                return (
                    <HandleLegacy ref={handleDefaultRef} {...handleConfig}>
                        {handleContent}
                    </HandleLegacy>
                );
            case "next":
                return (
                    <HandleNext ref={handleDefaultRef} {...handleConfig}>
                        {handleContent}
                    </HandleNext>
                );
            default:
                return <></>;
        }
    }
);
