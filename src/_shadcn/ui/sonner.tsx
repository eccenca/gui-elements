/**
 * Vendored shadcn/ui `sonner` Toaster wrapper (style: radix-nova).
 * Local adaptations: `next-themes`' `useTheme` is replaced with our `useDarkMode` hook
 * (observes the `dark` class on `<html>` — the library ships no theme provider). Icons and
 * CSS-variable theming are kept verbatim from the registry source.
 */
import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";

import { useDarkMode } from "../lib/use-dark-mode";

const Toaster = ({ ...props }: ToasterProps) => {
    const theme = useDarkMode();

    return (
        <Sonner
            theme={theme}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                    "--border-radius": "var(--radius)",
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: "cn-toast",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
