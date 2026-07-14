/**
 * Combines class values (strings, arrays, conditional objects) via `clsx` and resolves
 * conflicting Tailwind utility classes via `tailwind-merge` (last one wins).
 *
 * The implementation is the CLI-managed shadcn `utils` module; this re-export keeps the
 * long-standing `common/utils/cn` import path of the library and its consumers working.
 */
export { cn } from "../../_shadcn/lib/utils";
