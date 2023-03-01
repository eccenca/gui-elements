import React, { memo, useState, useEffect, useRef } from "react";
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

interface EdgeLabelObjectProps {
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
    edgeCenter
} : EdgeLabelObjectProps) => {
    const containerRef = useRef<SVGForeignObjectElement>(null);
    const [ labelSize, setLabelSize ] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        const labelElement = containerRef.current!.getElementsByClassName(`${eccgui}-graphviz__edge-label`);
        if (labelElement.length > 0 && labelSize[0] === 0) {
            setLabelSize([
                (labelElement[0] as HTMLElement).offsetWidth,
                (labelElement[0] as HTMLElement).offsetHeight
            ]);
        }
    })

    return (
        <foreignObject
            ref={containerRef}
            className={`${eccgui}-graphviz__edge-labelobject`}
            width={labelSize[0]}
            height={labelSize[1]}
            x={edgeCenter[0] - labelSize[0]/2}
            y={edgeCenter[1] - labelSize[1]/2}
            requiredExtensions="http://www.w3.org/1999/xhtml"
        >
            <body>
                { children }
            </body>
        </foreignObject>
    )
});
