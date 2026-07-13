/**
 * `useDarkMode` — reports the current color scheme by observing the `dark` class on
 * `document.documentElement` (the convention Tailwind's `darkMode: "class"` uses).
 *
 * This replaces `next-themes`' `useTheme` for the vendored shadcn/ui primitives: the
 * library ships without a theme provider, so the source of truth is simply whether the
 * `dark` class is present on `<html>`. The initial value is read synchronously from the
 * current `classList`; subsequent toggles are picked up via a `MutationObserver` that is
 * torn down on unmount.
 */
import * as React from "react";

function readDarkMode(): "light" | "dark" {
    if (typeof document === "undefined") {
        return "light";
    }
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useDarkMode(): "light" | "dark" {
    const [mode, setMode] = React.useState<"light" | "dark">(readDarkMode);

    React.useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }
        const root = document.documentElement;
        const update = () => setMode(root.classList.contains("dark") ? "dark" : "light");
        // Re-sync in case the class changed between the initial render and this effect.
        update();
        const observer = new MutationObserver(update);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    return mode;
}
