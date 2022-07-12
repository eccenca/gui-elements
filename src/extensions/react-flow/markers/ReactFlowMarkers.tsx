import React, { FC } from "react";

import { MarkerArrowClosedInverse } from "./MarkerArrowClosedInverse";

export const ReactFlowMarkers: FC = () => {
    return (
        <svg>
            <defs>
                <MarkerArrowClosedInverse />
            </defs>
        </svg>
    );
};
