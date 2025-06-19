import React from "react";

export const EdgeDefs = React.memo(() => (
    <svg style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
            <marker
                id="arrow-closed"
                viewBox="-10 -10 20 20"
                markerWidth="10"
                markerHeight="10"
                refX="0"
                refY="0"
                orient="auto"
            >
                <path d="M-4,-4 L4,0 L-4,4 Z" fill="currentColor" />
            </marker>
            <marker
                id="arrow-closed-reverse"
                viewBox="-10 -10 20 20"
                markerWidth="10"
                markerHeight="10"
                refX="0"
                refY="0"
                orient="auto-start-reverse"
            >
                <path d="M-4,-4 L4,0 L-4,4 Z" fill="currentColor" />
            </marker>
        </defs>
    </svg>
));
