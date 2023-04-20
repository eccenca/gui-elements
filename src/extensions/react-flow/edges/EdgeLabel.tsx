import React, { memo } from "react";
import { Icon, Depiction, DepictionProps, OverflowText } from "../../../index";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { ValidIconName } from "../../../components/Icon/canonicalIconNames";
import { IntentTypes, intentClassName } from "../../../common/Intent";

export interface EdgeLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Depiction element displayed left from the label.
     */
    depiction?: ValidIconName | React.ReactElement<DepictionProps>;
    /**
     * Label of the edge.
     * Cannot overflow the parent container.
     */
    text: string | JSX.Element;
    /**
     * One or multiple other elements displayed right from label.
     */
    actions?: JSX.Element | JSX.Element[];
    /**
     * The element is increased in its size.
     */
    large?: boolean;
    /**
     * Stretches the label component to the full available width.
     */
    fullWidth?: boolean;
    /**
     * Add a info state to the label, visualized by color.
     */
    intent?: IntentTypes;
}

export const EdgeLabel = memo(({
    depiction,
    text,
    actions,
    large,
    fullWidth,
    intent,
    ...otherDivProps
} : EdgeLabelProps) => {

    const depEl = (!!depiction && typeof depiction === "string")
        ? <Depiction image={<Icon name={depiction as ValidIconName} />} />
        : depiction;

    return (
        <div
            className={
                `${eccgui}-graphviz__edge-label` +
                (large ? ` ${eccgui}-graphviz__edge-label--large` : "") +
                (fullWidth ? ` ${eccgui}-graphviz__edge-label--fullwidth` : "") +
                (!!intent ? ` ${intentClassName(intent)}` : '')
            }
            {...otherDivProps}
        >
            {!!depEl && (
                <div className={`${eccgui}-graphviz__edge-label__depiction`}>
                    {
                        React.cloneElement(depEl, {
                            padding: "tiny",
                            ratio: "1:1",
                            resizing: "contain",
                            forceInlineSvg: true,
                            border: false,
                            backgroundColor: undefined,
                        })
                    }
                </div>
            )}
            <div className={`${eccgui}-graphviz__edge-label__text`}>
                { typeof text === "string" ? <OverflowText>{ text }</OverflowText> : text }
            </div>
            {!!actions && (
                <div className={`${eccgui}-graphviz__edge-label__aux`}>
                    { actions }
                </div>
            )}
        </div>
    )
});

interface EdgeLabelObjectProps extends React.SVGAttributes<SVGForeignObjectElement> {
    /**
     * The `<EdgeLabel />` element that need to be displayed.
     */
    children: React.ReactElement<EdgeLabelProps>;
    /**
     * Property from the `renderLabel` callback method.
     */
    edgeCenter: [number, number, number, number];
    /**
     * Number of milliseconds.
     * If set and larger then zero then the re-sizing process is repeated after this time.
     */
    resizeTimeout?: number;
}

export const EdgeLabelObject = memo(({
    children,
    edgeCenter,
    resizeTimeout = -1,
    ...otherForeignObjectProps
} : EdgeLabelObjectProps) => {
    const containerCallback = React.useCallback((containerRef) => {
        if (containerRef) labelSize(containerRef);
    }, [edgeCenter]);

    const labelSize = (container: SVGForeignObjectElement) => {
        const labelElement = container.getElementsByClassName(`${eccgui}-graphviz__edge-label`);
        if (labelElement.length > 0) {
            const width = (labelElement[0] as HTMLElement).offsetWidth;
            const height = (labelElement[0] as HTMLElement).offsetHeight;
            container.setAttribute("x", (edgeCenter[0] - width/2).toString());
            container.setAttribute("y", (edgeCenter[1] - height/2).toString());
            container.setAttribute("width", width.toString());
            container.setAttribute("height", height.toString());
        } else if (resizeTimeout > 0){
            // Content is not ready yet, recall resizing process after timeout.
            // This can happen in case the children is actually not a `EdgeLabel`.
            setTimeout(() => { labelSize(container)}, resizeTimeout);
        }
    }

    return (
        <foreignObject
            ref={containerCallback}
            className={`${eccgui}-graphviz__edge-labelobject`}
            width="1"
            height="1"
            {...otherForeignObjectProps}
            requiredExtensions="http://www.w3.org/1999/xhtml"
        >
            { children }
        </foreignObject>
    )
});
