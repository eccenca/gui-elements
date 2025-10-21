import React, { memo } from "react";
import { Edge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

import { ReactFlowVersions, useReactFlowVersion } from "../versionsupport";

import { EdgeDefault, EdgeDefaultV9DataProps, EdgeDefaultV9Props } from "./EdgeDefault";
import { EdgeDefaultV12DataProps, EdgeDefaultV12Props } from "./EdgeDefaultV12";
import { drawEdgeStep } from "./utils";

interface EdgeStepDataV9Props extends EdgeDefaultV9DataProps {
    stepCornerRadius?: number;
}
interface EdgeStepDataV12Props extends EdgeDefaultV12DataProps {
    stepCornerRadius?: number;
}

/**
 * @deprecated (v26) v9 support is removed after v25
 */
export interface EdgeStepV9Props extends EdgeDefaultV9Props {
    data?: EdgeStepDataV9Props;
}
/**
 * @deprecated (v26) v9 support is removed after v25
 */
export interface EdgeStepV12Props extends Omit<EdgeDefaultV12Props, "data">, EdgeProps<Edge<EdgeStepDataV12Props>> {}

export type EdgeStepProps = EdgeStepV9Props | EdgeStepV12Props;

/**
 * This element cannot be used directly, it must be connected via a `edgeTypes` definition.
 * @see https://reactflow.dev/docs/api/nodes/
 */
export const EdgeStep = memo((props: EdgeStepProps) => {
    const flowVersionCheck = useReactFlowVersion();
    switch (flowVersionCheck) {
        case ReactFlowVersions.V9:
            return <EdgeDefault {...(props as EdgeDefaultV9Props)} drawSvgPath={drawEdgeStep} />;
        case ReactFlowVersions.V12:
            return (
                <EdgeDefault
                    {...(props as EdgeDefaultV12Props)}
                    getPath={(params) => {
                        return getSmoothStepPath({ ...params, borderRadius: props.data?.stepCornerRadius ?? 7 });
                    }}
                />
            );
        default:
            return <></>;
    }
});
