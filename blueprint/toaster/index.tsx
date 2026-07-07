/**
 * Deprecated, Blueprint-free stub for the historical `Toaster` (Blueprint's `OverlayToaster`).
 *
 * The Blueprint foundation has been removed. This module only survives so the import path
 * `@eccenca/gui-elements/blueprint/toaster` and its `Toaster` export stay resolvable; it has no
 * consumers (verified by grep across app + lib) and provides no functionality.
 *
 * @deprecated (v27) will be completely removed. Use the application's own toast/notification
 * system instead.
 */

const deprecationNotice =
    "[@eccenca/gui-elements] `Toaster` (blueprint/toaster) is deprecated and inert after the Blueprint removal; " +
    "use the application's own toast/notification system instead.";

let warned = false;
const warnOnce = (): void => {
    // one-time, dev-only warning (guarded so it never throws in production or non-Node runtimes)
    const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
    if (!warned && nodeEnv !== "production" && typeof console !== "undefined") {
        warned = true;
        // eslint-disable-next-line no-console
        console.warn(deprecationNotice);
    }
};

/** Inert stand-in for a created toaster instance; every method is a no-op. */
const toasterInstanceStub = {
    show: () => "",
    dismiss: () => undefined,
    clear: () => undefined,
    getToasts: () => [] as unknown[],
};

/**
 * No-op replacement for Blueprint's `OverlayToaster`. Accessing/using it logs a one-time
 * deprecation warning; all toaster operations are inert.
 */
const Toaster = {
    create: (..._args: unknown[]) => {
        warnOnce();
        return Promise.resolve(toasterInstanceStub);
    },
};

export { Toaster };
export default Toaster;
