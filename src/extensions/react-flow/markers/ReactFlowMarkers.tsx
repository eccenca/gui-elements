import React, { FC } from "react";

// FIXME: we need to check how these markers are used and if we can justify the namings

import { MarkerArrowClosedInverse } from "./MarkerArrowClosedInverse";

const ReactFlowMarkers: FC = () => {
    return (
        <svg>
            <defs>
                <MarkerArrowClosedInverse />
            </defs>
        </svg>
    );
};

export {
    MarkerArrowClosedInverse,
    ReactFlowMarkers
}
