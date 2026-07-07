/**
 * Historical Blueprint skeleton classname (`Classes.SKELETON` from `@blueprintjs/core`,
 * i.e. `"bp6-skeleton"`). Kept byte-identical for backward compatibility with anything that
 * still keys off this exact string - this value is re-exported as part of the library's
 * public `ClassNames` aggregate (see `Skeleton` namespace in `src/index.ts`).
 *
 * No longer sourced from `@blueprintjs/core`: the historical runtime value is hardcoded so
 * this module has zero Blueprint dependency. Visual styling now lives in `Skeleton.tsx`
 * (Tailwind `animate-pulse`/`bg-muted` utilities applied directly to the wrapped children).
 */
export const SKELETON = "bp6-skeleton";
