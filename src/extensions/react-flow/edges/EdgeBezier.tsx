import React, { memo } from "react";
import { Edge, EdgeProps, getBezierPath } from "@xyflow/react";

import { ReactFlowVersions, useReactFlowVersion } from "../versionsupport";

import { EdgeDefault, EdgeDefaultV9Props } from "./EdgeDefault";
import { EdgeDefaultV12DataProps, EdgeDefaultV12Props } from "./EdgeDefaultV12";

interface EdgeBezierDataV12Props extends EdgeDefaultV12DataProps {
    curvature?: number;
}

/**
 * @deprecated (v26) v9 support is removed after v25
 */
export interface EdgeBezierV12Props
    extends Omit<EdgeDefaultV12Props, "data">,
        EdgeProps<Edge<EdgeBezierDataV12Props>> {}

export type EdgeBezierProps = EdgeDefaultV9Props | EdgeBezierV12Props;

/**
 * This element cannot be used directly, it must be connected via a `edgeTypes` definition.
 * Our v9 edges do not support bezier paths.
 * @see https://reactflow.dev/docs/api/nodes/
 */
export const EdgeBezier = memo((props: EdgeBezierProps) => {
    const flowVersionCheck = useReactFlowVersion();
    switch (flowVersionCheck) {
        case ReactFlowVersions.V9:
            return <EdgeDefault {...(props as EdgeDefaultV9Props)} />;
        case ReactFlowVersions.V12:
            return (
                <EdgeDefault
                    {...(props as EdgeDefaultV12Props)}
                    getPath={(params) => {
                        return getBezierPath({
                            ...params,
                            curvature: (props.data as EdgeBezierDataV12Props)?.curvature,
                        });
                    }}
                />
            );
        default:
            return <></>;
    }
});
