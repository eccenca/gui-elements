/**
 * Vendored shadcn/ui `command` (style: radix-nova, on cmdk).
 * Local adaptations: `cn` import path, local `Dialog` primitives for `CommandDialog`,
 * `React.forwardRef` re-added (React 18 — registry code relies on React-19 ref-as-prop).
 * `CommandInput` is rebuilt without the registry's `input-group` primitive (not vendored
 * here): it renders a self-contained bordered field with a leading search icon, preserving
 * the `data-slot="command-input"` / `data-slot="command-input-wrapper"` hooks.
 */
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon, CheckIcon } from "lucide-react";

import { cn } from "../../common/utils/cn";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./dialog";

const Command = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive
            ref={ref}
            data-slot="command"
            className={cn(
                "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
                className
            )}
            {...props}
        />
    );
});
Command.displayName = "Command";

function CommandDialog({
    title = "Command Palette",
    description = "Search for a command to run...",
    children,
    className,
    showCloseButton = false,
    ...props
}: React.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
}) {
    return (
        <Dialog {...props}>
            <DialogHeader className="sr-only">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogContent
                className={cn("top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0", className)}
                showCloseButton={showCloseButton}
            >
                {children}
            </DialogContent>
        </Dialog>
    );
}

const CommandInput = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
    return (
        <div
            data-slot="command-input-wrapper"
            className="m-1 mb-0 flex h-8 items-center gap-2 rounded-lg border border-input/30 bg-input/30 px-2"
        >
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
                ref={ref}
                data-slot="command-input"
                className={cn(
                    "flex h-full w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        </div>
    );
});
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive.List
            ref={ref}
            data-slot="command-list"
            className={cn("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className)}
            {...props}
        />
    );
});
CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Empty>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive.Empty
            ref={ref}
            data-slot="command-empty"
            className={cn("py-6 text-center text-sm", className)}
            {...props}
        />
    );
});
CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive.Group
            ref={ref}
            data-slot="command-group"
            className={cn(
                "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
                className
            )}
            {...props}
        />
    );
});
CommandGroup.displayName = "CommandGroup";

const CommandSeparator = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive.Separator
            ref={ref}
            data-slot="command-separator"
            className={cn("-mx-1 h-px bg-border", className)}
            {...props}
        />
    );
});
CommandSeparator.displayName = "CommandSeparator";

const CommandItem = React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, children, ...props }, ref) => {
    return (
        <CommandPrimitive.Item
            ref={ref}
            data-slot="command-item"
            className={cn(
                "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
                className
            )}
            {...props}
        >
            {children}
            <CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
        </CommandPrimitive.Item>
    );
});
CommandItem.displayName = "CommandItem";

const CommandShortcut = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
    ({ className, ...props }, ref) => {
        return (
            <span
                ref={ref}
                data-slot="command-shortcut"
                className={cn(
                    "ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground",
                    className
                )}
                {...props}
            />
        );
    }
);
CommandShortcut.displayName = "CommandShortcut";

export {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
};
