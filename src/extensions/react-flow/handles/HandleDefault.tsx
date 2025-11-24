import React, { memo } from "react";
import { Handle as HandleV9, HandleProps as ReactFlowHandleV9Props } from "react-flow-renderer";
import { Classes as BlueprintClasses } from "@blueprintjs/core";
import {Intent} from "@blueprintjs/core/src/common/intent";
import { Handle as HandleV12, HandleProps as ReactFlowHandleV12Props } from "@xyflow/react";

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

/**
 * @deprecated (v26) use only `HandleDefaultProps`
 */
export interface HandleV9Props extends HandleExtensionProps, ReactFlowHandleV9Props {}
/**
 * @deprecated (v26) use only `HandleDefaultProps`
 */
export interface HandleV12Props extends HandleExtensionProps, ReactFlowHandleV12Props {}

/**
 * Combined interface, later this will be only a copy of `HandleV12Props`.
 */
export type HandleDefaultProps = HandleV9Props | HandleV12Props;

export const HandleDefault = memo(
    ({ flowVersion, data, tooltip, children, category, intent, ...handleProps }: HandleDefaultProps) => {
        const evaluateFlowVersion = useReactFlowVersion();
        const flowVersionCheck = flowVersion || evaluateFlowVersion;
        const handleDefaultRef = React.useRef<HTMLDivElement>(null);
        const [extendedTooltipDisplayed, setExtendedTooltipDisplayed] = React.useState<boolean>(false);

        let toolsTarget: HTMLCollectionOf<Element>;

        React.useEffect(() => {
            if (handleDefaultRef.current) {
                toolsTarget = handleDefaultRef.current.getElementsByClassName(`${eccgui}-graphviz__handletools-target`);
                if (toolsTarget && toolsTarget[0]) {
                    // Polyfill for FF that does not support the `:has()` pseudo selector until at least version 119 or 120
                    // need to be re-evaluated then
                    // @see https://connect.mozilla.org/t5/ideas/when-is-has-css-selector-going-to-be-fully-implemented-in/idi-p/23794
                    handleDefaultRef.current.classList.add(`ffpolyfill-has-${eccgui}-graphviz__handletools-target`);
                }
            }
        });

        const tooltipTitle = tooltip ? { title: tooltip } : {};

        const handleContentTooltipProps: Partial<TooltipProps> = {
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
            intent: intent as Intent,
            className: `${eccgui}-graphviz__handle__tooltip-target`,
            isOpen: extendedTooltipDisplayed,
        }

        const handleContentProps = React.useMemo(() => ({
            ...data,
            tooltipProps: {
                ...handleContentTooltipProps,
                ...data?.tooltipProps,
            } as TooltipProps,
        }), [intent, category, handleProps.isConnectable])

        const handleContent = React.useMemo(() => <HandleContent {...handleContentProps}>{children}</HandleContent>, [])

        let switchTooltipTimerOn: ReturnType<typeof setTimeout>;
        let switchToolsTimerOff: ReturnType<typeof setTimeout>;

        const handleConfig =  React.useMemo(() => ({
            ...handleProps,
            ...tooltipTitle,
            className: intent ? `${intentClassName(intent)} ` : "" + ` ${eccgui}-graphviz__handle ${eccgui}-graphviz__handle--${flowVersionCheck}`,
            onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                if (handleProps.onClick) {
                    handleProps.onClick(e);
                }
                if (toolsTarget.length > 0 && e.target === handleDefaultRef.current) {
                    setExtendedTooltipDisplayed(false);
                    (toolsTarget[0] as HTMLElement).click();
                }
            },
            "data-category": category,
            onMouseEnter: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
                    switchToolsTimerOff = setTimeout(() => (toolsTarget[0] as HTMLElement).click(), 500);
                }
                setExtendedTooltipDisplayed(false);
            },
        }), [intent, category, tooltip, handleProps.isConnectable, handleProps.style]);

        switch (flowVersionCheck) {
            case "v9":
                return (
                    <HandleV9 ref={handleDefaultRef} {...(handleConfig as HandleV9Props)}>
                        {handleContent}
                    </HandleV9>
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
