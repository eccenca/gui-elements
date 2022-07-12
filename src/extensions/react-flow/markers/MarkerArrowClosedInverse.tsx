import React, { FC } from "react";

export const MarkerArrowClosedInverse: FC = () => {
    return (
        <marker
            className="react-flow__arrowhead"
            id="react-flow__arrowclosed-inverse"
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            orient="auto"
            refX="0"
            refY="0"
        >
            <polyline
                stroke="#b1b1b7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                fill="#b1b1b7"
                points="5,-4 0,0 5,4 5,-4"
            ></polyline>
        </marker>
    );
};
