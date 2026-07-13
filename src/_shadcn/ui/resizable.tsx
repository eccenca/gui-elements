/**
 * Vendored shadcn/ui `resizable` (style: radix-nova, on react-resizable-panels v4).
 * Local adaptations: `cn` import path, `React.forwardRef` re-added (React 18 — the
 * registry code relies on React-19 ref-as-prop; v4 exposes the root DOM node via the
 * `elementRef` prop, so the forwarded ref is mapped onto it). Imperative handles keep
 * flowing through the library's own `groupRef`/`panelRef` props.
 * Layout hooks/types are re-exported so consumers need no direct dependency on
 * react-resizable-panels.
 */
import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "../../common/utils/cn";

const ResizablePanelGroup = React.forwardRef<HTMLDivElement, ResizablePrimitive.GroupProps>(
    ({ className, ...props }, ref) => {
        return (
            <ResizablePrimitive.Group
                elementRef={ref}
                data-slot="resizable-panel-group"
                className={cn("flex h-full w-full aria-[orientation=vertical]:flex-col", className)}
                {...props}
            />
        );
    }
);
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePrimitive.PanelProps>(({ ...props }, ref) => {
    return <ResizablePrimitive.Panel elementRef={ref} data-slot="resizable-panel" {...props} />;
});
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef<
    HTMLDivElement,
    ResizablePrimitive.SeparatorProps & {
        withHandle?: boolean;
    }
>(({ withHandle, className, ...props }, ref) => {
    return (
        <ResizablePrimitive.Separator
            elementRef={ref}
            data-slot="resizable-handle"
            className={cn(
                "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
                className
            )}
            {...props}
        >
            {withHandle && <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />}
        </ResizablePrimitive.Separator>
    );
});
ResizableHandle.displayName = "ResizableHandle";

const { useDefaultLayout, useGroupRef, useGroupCallbackRef, usePanelRef, usePanelCallbackRef } = ResizablePrimitive;

export type {
    GroupImperativeHandle,
    GroupProps,
    Layout,
    LayoutStorage,
    Orientation,
    PanelImperativeHandle,
    PanelProps,
    PanelSize,
    SeparatorProps,
    SizeUnit,
} from "react-resizable-panels";

export {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    useDefaultLayout,
    useGroupCallbackRef,
    useGroupRef,
    usePanelCallbackRef,
    usePanelRef,
};
