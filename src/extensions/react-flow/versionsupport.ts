import { useStoreState as useStoreStateFlowLegacy } from "react-flow-renderer";
import { useStore as useStoreStateFlowNext } from "react-flow-renderer-lts";

export interface ReacFlowVersionSupportProps {
    /**
     * Spevifies the context of the react flow renderer version that is used for the component.
     */
    flowVersion?: "legacy" | "next" | "none";
}

export const useReactFlowVersion = () => {
    try {
        const [, , zoom] = useStoreStateFlowLegacy((state) => state.transform);
        return !!zoom ? "legacy" : "none";
    } catch {}
    try {
        const [, , zoom] = useStoreStateFlowNext((state) => state.transform);
        return !!zoom ? "next" : "none";
    } catch {}

    return "none";
}
