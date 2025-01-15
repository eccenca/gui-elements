import React, { memo } from "react";
import { Handle as HandleV9, HandleProps as ReactFlowHandleV9Props } from "react-flow-renderer";
import { Handle as HandleV10, HandleProps as ReactFlowHandleV10Props } from "react-flow-renderer-lts";
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

/**
 * @deprecated (v26) use only `HandleDefaultProps`
 */ 
export interface HandleV9Props extends HandleExtensionProps, ReactFlowHandleV9Props {}
/**
 * @deprecated (v26) use only `HandleDefaultProps`
 */ 
export interface HandleV10Props extends HandleExtensionProps, ReactFlowHandleV10Props {}

export type HandleDefaultProps = HandleV9Props | HandleV10Props;

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
        };

        switch (flowVersionCheck) {
            case "v9":
                return (
                    <HandleV9 ref={handleDefaultRef} {...handleConfig}>
                        {handleContent}
                    </HandleV9>
                );
            case "v10":
                return (
                    <HandleV10 ref={handleDefaultRef} {...handleConfig}>
                        {handleContent}
                    </HandleV10>
                );
            default:
                return <></>;
        }
    }
);
