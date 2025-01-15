import { useStoreState as getStoreStateFlowV9 } from "react-flow-renderer";
import { useStore as getStoreStateFlowV10 } from "react-flow-renderer-lts";

export interface ReacFlowVersionSupportProps {
    /**
     * Specifies the context of the react flow renderer version that is used for the component.
     */
    flowVersion?: "v9" | "v10" | "none";
}

export const useReactFlowVersion = () => {
    try {
        const [, , zoom] = getStoreStateFlowV9((state) => state.transform);
        return zoom ? "v9" : "none";
    // eslint-disable-next-line no-empty
    } catch {}
    try {
        const [, , zoom] = getStoreStateFlowV10((state) => state.transform);
        return zoom ? "v10" : "none";
    // eslint-disable-next-line no-empty
    } catch {}

    return "none";
};
