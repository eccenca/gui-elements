import React, { FC } from "react";

import { MarkerArrowClosedInverse } from "./MarkerArrowClosedInverse";

export const Markers: FC = () => {
    return (
        <svg>
            <defs>
                <MarkerArrowClosedInverse />
            </defs>
        </svg>
    );
};
