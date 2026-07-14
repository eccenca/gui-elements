/**
 * Marker classname applied to every element wrapped by `<Skeleton />`. It carries no styling
 * of its own (visuals live in `Skeleton.tsx` as Tailwind utilities applied to the wrapped
 * children) and exists so consumers can key off skeleton state in selectors or tests. This
 * value is re-exported as part of the library's public `ClassNames` aggregate (see `Skeleton`
 * namespace in `src/index.ts`).
 *
 * v27: renamed from the historical Blueprint value `"bp6-skeleton"`.
 */
export const SKELETON = "eccgui-skeleton";
