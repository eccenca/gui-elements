import { ClassNames as IntentClassNames } from "./common/Intent";
import * as Skeleton from "./components/Skeleton/classnames";
import * as TypographyClassNames from "./components/Typography/classnames";

/**
 * Deprecated, Blueprint-free stub replacing the former `Classes` object from `@blueprintjs/core`.
 *
 * The Blueprint foundation has been removed. To keep `ClassNames.Blueprint.<anything>` resolvable
 * for any lingering call site, this loosely-typed proxy returns an empty string for every property
 * access and for every function call (so both `ClassNames.Blueprint.SOME_CONST` used as a class
 * name and `ClassNames.Blueprint.someClass(x)` produce `""`), while logging a one-time dev warning.
 *
 * @deprecated Emits no class names anymore. Use the foundation-independent members
 * (`ClassNames.Intent` / `.Skeleton` / `.Typography`) or Tailwind utilities instead.
 */
const BlueprintClassNamesStub: Record<string, any> = (() => {
    let warned = false;
    const warnOnce = (): void => {
        const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
        if (!warned && nodeEnv !== "production" && typeof console !== "undefined") {
            warned = true;
            // eslint-disable-next-line no-console
            console.warn(
                "[@eccenca/gui-elements] `ClassNames.Blueprint` is deprecated and emits no class names " +
                    "after the Blueprint removal; use `ClassNames.Intent`/`.Skeleton`/`.Typography` or Tailwind utilities.",
            );
        }
    };
    // A value that behaves both as an empty string (when coerced/used as a class name) and as a
    // function returning an empty string (when called, e.g. the former `elevationClass(1)`).
    const emptyStringCallable = (): string => "";
    (emptyStringCallable as any).toString = () => "";
    (emptyStringCallable as any)[Symbol.toPrimitive] = () => "";
    return new Proxy(
        {},
        {
            get: (_target, prop) => {
                if (prop === Symbol.toPrimitive || prop === "toString" || prop === Symbol.toStringTag) {
                    return () => "";
                }
                warnOnce();
                return emptyStringCallable;
            },
        },
    ) as Record<string, any>;
})();

const ClassNames = {
    /**
     * @deprecated Blueprint-free no-op stub (the Blueprint foundation has been removed). Every
     * access returns `""`; prefer the foundation-independent members below or Tailwind utilities.
     */
    Blueprint: BlueprintClassNamesStub,
    Intent: IntentClassNames,
    Skeleton,
    Typography: TypographyClassNames,
};

export * from "./configuration/constants";
export * from "./common";
export { cn } from "./common/utils/cn";
export * from "./components";
export * from "./extensions";
export * from "./cmem";
export * as shadcn from "./_shadcn";

export { ClassNames };
