import React from "react";
// Blueprint removed: inert passthrough (the former OverlaysProvider context is no longer needed)
const OverlaysProvider = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
import { Meta, StoryFn } from "@storybook/react";

import { SimpleDialog } from "../../components";

import { Button } from "./button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

/**
 * Phase-0 gate stories for the vendored shadcn/ui primitives.
 *
 * 1. `ButtonWithTooltipAsChild` — a vendored shadcn Button used as `asChild` trigger of the
 *    vendored Tooltip. If the re-added `React.forwardRef` adaptations were broken, Radix could
 *    not anchor the tooltip to the button DOM node (React 18 has no ref-as-prop).
 * 2. `DropdownInsideSimpleDialog` — the mixed-overlay gate: a vendored (Radix) DropdownMenu
 *    rendered inside the EXISTING Blueprint-based gui-elements `SimpleDialog`.
 */
export default {
    title: "Experimental/shadcn Gate",
    component: Button,
} as Meta<typeof Button>;

const TemplateTooltip: StoryFn<typeof Button> = (args) => (
    <TooltipProvider>
        <div style={{ padding: "5rem" }}>
            <Tooltip defaultOpen>
                <TooltipTrigger asChild>
                    <Button {...args} />
                </TooltipTrigger>
                <TooltipContent>Tooltip anchored via forwardRef (asChild)</TooltipContent>
            </Tooltip>
        </div>
    </TooltipProvider>
);

export const ButtonWithTooltipAsChild = TemplateTooltip.bind({});
ButtonWithTooltipAsChild.args = {
    children: "shadcn Button (hover me)",
    variant: "default",
    size: "default",
};

const TemplateMixedOverlay: StoryFn<typeof SimpleDialog> = (args) => (
    <OverlaysProvider>
        <div style={{ height: "400px" }}>
            <SimpleDialog {...args}>
                <p>
                    This is the existing (Blueprint-based) <code>SimpleDialog</code>. The dropdown below is the
                    vendored shadcn/Radix <code>DropdownMenu</code> — the mixed-overlay stack gate.
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Open shadcn dropdown</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Radix menu in Blueprint dialog</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>First action</DropdownMenuItem>
                        <DropdownMenuItem>Second action</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">Destructive action</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SimpleDialog>
        </div>
    </OverlaysProvider>
);

export const DropdownInsideSimpleDialog = TemplateMixedOverlay.bind({});
DropdownInsideSimpleDialog.args = {
    title: "Mixed overlay gate",
    isOpen: true,
    usePortal: false,
    canEscapeKeyClose: true,
};
