import React, { memo, useEffect, useRef } from "react";
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
}

export const EdgeLabelObject = memo(({
    children,
    edgeCenter,
    ...otherForeignObjectProps
} : EdgeLabelObjectProps) => {
    const containerRef = useRef<SVGForeignObjectElement>(null);

    useEffect(() => {
        const labelElement = containerRef.current!.getElementsByClassName(`${eccgui}-graphviz__edge-label`);
        if (labelElement.length > 0) {
            const width = (labelElement[0] as HTMLElement).offsetWidth;
            const height = (labelElement[0] as HTMLElement).offsetHeight;
            containerRef.current!.setAttribute("width", width.toString());
            containerRef.current!.setAttribute("height", height.toString());
            containerRef.current!.setAttribute("x", (edgeCenter[0] - width/2).toString());
            containerRef.current!.setAttribute("y", (edgeCenter[1] - height/2).toString());
        }
    })

    return (
        <foreignObject
            ref={containerRef}
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