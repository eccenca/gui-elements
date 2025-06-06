import React, { memo } from "react";
import { Handle as HandleLegacy, HandleProps as ReactFlowHandleLegacyProps } from "react-flow-renderer";
import { Handle as HandleNext, HandleProps as ReactFlowHandleNextProps } from "react-flow-renderer-lts";
import { Handle as HandleV12, HandleProps as ReactFlowHandleV12Props } from "@xyflow/react";
import { Classes as BlueprintClasses } from "@blueprintjs/core";

import { intentClassName, IntentTypes } from "../../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { TooltipProps } from "../../../index";
import { ReacFlowVersionSupportProps, useReactFlowVersion } from "../versionsupport";

import { HandleContent, HandleContentProps } from "./HandleContent";

export type HandleCategory = "configuration" | "flexible" | "fixed" | "unknown" | "dependency";

interface HandleExtensionProps
    extends ReacFlowVersionSupportProps,
        Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "children"> {
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
}

export interface HandleProps extends HandleExtensionProps, ReactFlowHandleLegacyProps {}
export interface HandleNextProps extends HandleExtensionProps, ReactFlowHandleNextProps {}
export interface HandleV12Props extends HandleExtensionProps, ReactFlowHandleV12Props {}
export type HandleDefaultProps = HandleProps | HandleNextProps | HandleV12Props;

export const HandleDefault = memo(
    ({ flowVersion, data, tooltip, children, category, intent, ...handleProps }: HandleDefaultProps) => {
        const evaluateFlowVersion = useReactFlowVersion();
        const flowVersionCheck = flowVersion || evaluateFlowVersion;
        const handleDefaultRef = React.useRef<any>();
        const [extendedTooltipDisplayed, setExtendedTooltipDisplayed] = React.useState<boolean>(false);

        let toolsTarget: HTMLElement[];

        React.useEffect(() => {
            toolsTarget = handleDefaultRef.current.getElementsByClassName(`${eccgui}-graphviz__handletools-target`);
            if (toolsTarget && toolsTarget[0]) {
                // Polyfill for FF that does not support the `:has()` pseudo selector until at least version 119 or 120
                // need to be re-evaluated then
                // @see https://connect.mozilla.org/t5/ideas/when-is-has-css-selector-going-to-be-fully-implemented-in/idi-p/23794
                handleDefaultRef.current.classList.add(`ffpolyfill-has-${eccgui}-graphviz__handletools-target`);
            }
        });

        const tooltipTitle = tooltip ? { title: tooltip } : {};

        const handleContentTooltipProps = {
            placement:
                handleProps.position === "left" || handleProps.position === "right"
                    ? `${handleProps.position}-end`
                    : undefined,
            modifiers: {
                offset: {
                    enabled: true,
                    options: {
                        offset: [3, 20],
                    },
                },
            },
            intent: intent,
            className: `${eccgui}-graphviz__handle__tooltip-target`,
            isOpen: extendedTooltipDisplayed,
        };

        const handleContentProps = {
            ...data,
            tooltipProps: {
                ...handleContentTooltipProps,
                ...data?.tooltipProps,
            } as TooltipProps,
        };

        const handleContent = <HandleContent {...handleContentProps}>{children}</HandleContent>;

        let switchTooltipTimerOn: ReturnType<typeof setTimeout>;
        let switchToolsTimerOff: ReturnType<typeof setTimeout>;

        const handleConfig = {
            ...handleProps,
            ...tooltipTitle,
            className: intent ? `${intentClassName(intent)} ` : "",
            onClick: (e: any) => {
                if (handleProps.onClick) {
                    handleProps.onClick(e);
                }
                if (toolsTarget.length > 0 && e.target === handleDefaultRef.current) {
                    setExtendedTooltipDisplayed(false);
                    toolsTarget[0].click();
                }
            },
            "data-category": category,
            onMouseEnter: (e: any) => {
                if (switchToolsTimerOff) clearTimeout(switchToolsTimerOff);
                if (e.target === handleDefaultRef.current) {
                    switchTooltipTimerOn = setTimeout(
                        () => setExtendedTooltipDisplayed(true),
                        data?.tooltipProps?.hoverOpenDelay ?? 500
                    );
                }
            },
            onMouseLeave: () => {
                if (switchTooltipTimerOn) clearTimeout(switchTooltipTimerOn);
                if (toolsTarget.length > 0 && toolsTarget[0].classList.contains(BlueprintClasses.POPOVER_OPEN)) {
                    switchToolsTimerOff = setTimeout(() => toolsTarget[0].click(), 500);
                }
                setExtendedTooltipDisplayed(false);
            },
        };

        switch (flowVersionCheck) {
            case "legacy":
                return (
                    <HandleLegacy ref={handleDefaultRef} {...(handleConfig as HandleProps)}>
                        {handleContent}
                    </HandleLegacy>
                );
            case "next":
                return (
                    <HandleNext ref={handleDefaultRef} {...(handleConfig as HandleNextProps)}>
                        {handleContent}
                    </HandleNext>
                );
            case "v12":
                return (
                    <HandleV12 ref={handleDefaultRef} {...(handleConfig as HandleV12Props)}>
                        {handleContent}
                    </HandleV12>
                );

            default:
                return <></>;
        }
    }
);
