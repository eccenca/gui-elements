import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class values (strings, arrays, conditional objects) via `clsx` and resolves
 * conflicting Tailwind utility classes via `tailwind-merge` (last one wins).
 *
 * This is the canonical `cn()` helper used by the vendored shadcn/ui primitives in
 * `src/_shadcn/ui/*` and by Tailwind-based recipes inside the library.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
