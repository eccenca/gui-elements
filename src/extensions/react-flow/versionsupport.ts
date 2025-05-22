import { useStoreState as getStoreStateFlowV9 } from "react-flow-renderer";
import { useStore as getStoreStateFlowV10 } from "react-flow-renderer-lts";
import { useStore as useStoreStateFlowV12 } from "@xyflow/react";

export const enum ReactFlowVersions {
    NONE = "none",
    V9 = "v9",
    V10 = "v10",
    V12 = "v12",
};

export interface ReacFlowVersionSupportProps {
    /**
     * Specifies the context of the react flow renderer version that is used for the component.
     */
    flowVersion?: ReactFlowVersions.V9 | ReactFlowVersions.V10 | ReactFlowVersions.V12 | ReactFlowVersions.NONE;
}

export const useReactFlowVersion = () => {
    try {
        const [, , zoom] = getStoreStateFlowV9((state) => state.transform);
        return zoom ? ReactFlowVersions.V9 : ReactFlowVersions.NONE;
    // eslint-disable-next-line no-empty
    } catch {}
    try {
        const [, , zoom] = getStoreStateFlowV10((state) => state.transform);
        return zoom ? ReactFlowVersions.V10 : ReactFlowVersions.NONE;
    // eslint-disable-next-line no-empty
    } catch {}
    try {
        const [, , zoom] = useStoreStateFlowV12((state) => state.transform);
        return zoom ? ReactFlowVersions.V12 : ReactFlowVersions.NONE;
    // eslint-disable-next-line no-empty
    } catch {}
    return ReactFlowVersions.NONE;
};
