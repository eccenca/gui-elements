import React from "react";
import { useStoreState as getStoreStateFlowV9 } from "react-flow-renderer";
import { useStore as useStoreStateFlowV12 } from "@xyflow/react";

export const enum ReactFlowVersions {
    NONE = "none", // mainly here in case some ReactFlow components are used without any react flow containr
    V9 = "v9",
    V12 = "v12",
}

export interface ReacFlowVersionSupportProps {
    /**
     * Specifies the context of the react flow renderer version that is used for the component.
     */
    flowVersion?: ReactFlowVersions.V9 | ReactFlowVersions.V12 | ReactFlowVersions.NONE;
}

type ProvidedReactFlowVersion = ReactFlowVersions.V9 | ReactFlowVersions.V12 | ReactFlowVersions.NONE;

/**
 * Explicit react-flow version channel. When a {@link ReactFlowVersionProvider} sits above a
 * component, {@link useReactFlowVersion} reads the version straight from here instead of probing
 * the mounted react-flow store. `undefined` means "no provider present" (fall back to probing).
 */
const ReactFlowVersionContext = React.createContext<ProvidedReactFlowVersion | undefined>(undefined);

export interface ReactFlowVersionProviderProps {
    /** The react-flow renderer version rendered below this provider. */
    version: ProvidedReactFlowVersion;
    children?: React.ReactNode;
}

/**
 * Declares the active react-flow renderer version for the subtree below it, so descendant
 * gui-elements react-flow components can resolve it deterministically (via {@link useReactFlowVersion})
 * without the legacy store-probing fallback. Prefer wrapping a react-flow container with this
 * (or threading the `flowVersion` prop of {@link ReacFlowVersionSupportProps}) over relying on the probe.
 */
export const ReactFlowVersionProvider = ({ version, children }: ReactFlowVersionProviderProps) =>
    React.createElement(ReactFlowVersionContext.Provider, { value: version }, children);

/**
 * FALLBACK (legacy): detect the react-flow version by probing the mounted store. This calls two
 * store hooks guarded by try/catch — technically a Rules-of-Hooks violation that only works
 * because the mounted react-flow version (hence which probe throws) is stable across a component's
 * lifetime, so the effective hook order never changes between renders. Kept so that consumers with
 * no {@link ReactFlowVersionProvider} (and no explicit `flowVersion` prop) keep working unchanged.
 *
 * TODO(react-flow v9 retirement): react-flow-renderer (v9) is still imported by ~17 silk + 3 wsp
 * files. Once those migrate to `@xyflow/react` (v12), drop this probe together with the
 * `react-flow-renderer` import above and make the provider / `flowVersion` prop the only path.
 */
const probeReactFlowVersion = (): ReactFlowVersions => {
    try {
        const [, , zoom] = getStoreStateFlowV9((state) => state.transform);
        return zoom ? ReactFlowVersions.V9 : ReactFlowVersions.NONE;
        // eslint-disable-next-line no-empty
    } catch {}
    try {
        const [, , zoom] = useStoreStateFlowV12((state) => state.transform);
        return zoom ? ReactFlowVersions.V12 : ReactFlowVersions.NONE;
        // eslint-disable-next-line no-empty
    } catch {}
    return ReactFlowVersions.NONE;
};

export const useReactFlowVersion = (): ReactFlowVersions => {
    // Primary path: an explicit provider (or a component threading `flowVersion`) tells us the
    // version directly — no store probing, no Rules-of-Hooks hazard.
    const providedVersion = React.useContext(ReactFlowVersionContext);
    if (providedVersion !== undefined) {
        return providedVersion;
    }
    // No provider in the tree: fall back to the legacy store probe (see its doc comment). The
    // conditional call below is safe for the same "stable per lifetime" reason the probe itself is.

    return probeReactFlowVersion();
};
