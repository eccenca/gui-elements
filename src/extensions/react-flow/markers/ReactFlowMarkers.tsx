import React, { FC } from "react";

import { intentClassName, IntentTypes } from "../../../common/Intent";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

// FIXME: we need to check how these markers are used and if we can justify the namings
import { MarkerArrowClosedInverse } from "./MarkerArrowClosedInverse";

type ReactFlowMarkerAppearance = "arrow-closed";

interface ReactFlowMarkerProps extends React.SVGProps<SVGMarkerElement> {
    /**
     * Visual appearance of the marker.
     */
    appearance?: ReactFlowMarkerAppearance;
    /**
     * Feedback state of the marker.
     * SVG markers are reused by paths but they cannot inherit their state color automatically.
     */
    intent?: IntentTypes;
    /**
     * If set, then the marker orientation is reversed.
     * Can be used if a start marker should displayed similar to an end marker.
     */
    reverse?: boolean;
}

const ReactFlowMarker = ({ className, appearance = "arrow-closed", intent, reverse }: ReactFlowMarkerProps) => {
    const markerDisplay: Record<ReactFlowMarkerAppearance, unknown> = {
        "arrow-closed": (
            <path d="M-5,-4 L5,0 L-5,4 Z" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" />
        ),
    };

    return (
        <marker
            id={`react-flow__marker--${appearance}${intent ? `-${intent}` : ""}${reverse ? "-reverse" : ""}`}
            className={
                `${eccgui}-graphviz__marker` +
                (className ? ` ${className}` : "") +
                (intent ? ` ${intentClassName(intent)}` : "")
            }
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            refX="0"
            refY="0"
            orient={reverse ? "auto-start-reverse" : "auto"}
        >
            {markerDisplay[appearance] as React.ReactNode}
        </marker>
    );
};

const ReactFlowMarkers: FC = () => {
    const intents = ["none", "primary", "accent", "success", "warning", "danger", "info" ] as IntentTypes[];

    return (
        <svg>
            <defs>
                <MarkerArrowClosedInverse />
                {intents.map((intent) => (
                    <>
                        <ReactFlowMarker appearance="arrow-closed" intent={intent} />
                        <ReactFlowMarker appearance="arrow-closed" intent={intent} reverse />
                    </>
                ))}
            </defs>
        </svg>
    );
};

export { MarkerArrowClosedInverse, ReactFlowMarkers, ReactFlowMarker };
