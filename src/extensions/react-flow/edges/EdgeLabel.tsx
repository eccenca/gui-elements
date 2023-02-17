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
                        })
                    }
                </div>
            )}
            <div className={`${eccgui}-graphviz__edge-label__text`}>
                { text }
            </div>
            {!!actions && (
                <div className={`${eccgui}-graphviz__edge-label__aux`}>
                    { actions }
                </div>
            )}
        </div>
    )
});
