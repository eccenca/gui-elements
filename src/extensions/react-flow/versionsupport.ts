import { useStoreState as getStoreStateFlowLegacy } from "react-flow-renderer";
import { useStore as getStoreStateFlowNext } from "react-flow-renderer-lts";
import { useStore as useStoreFlowV12 } from "@xyflow/react";

export interface ReacFlowVersionSupportProps {
    /**
     * Spevifies the context of the react flow renderer version that is used for the component.
     * @deprecated (v25) `legacy` and `next` will be removed/replaced by `v##` values in future versions
     */
    flowVersion?: "v12" | "legacy" | "next" | "none";
}

export const useReactFlowVersion = () => {
    try {
        const [, , zoom] = getStoreStateFlowLegacy((state) => state.transform);
        return zoom ? "legacy" : "none";
    } catch {}
    try {
        const [, , zoom] = getStoreStateFlowNext((state) => state.transform);
        return zoom ? "next" : "none";
    } catch {}
    try {
        const [, , zoom] = useStoreFlowV12((state) => state.transform);
        return zoom ? "v12" : "none";
    } catch {}
    return "none";
};
