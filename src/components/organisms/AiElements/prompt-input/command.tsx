/**
 * Composer-styled wrappers around the shadcn `Command` (cmdk) primitives, for
 * slash-command / mention style palettes inside the prompt input.
 */
import type { ComponentProps } from "react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/_shadcn/ui/command";
import { cn } from "@/common/utils/cn";

export type PromptInputCommandProps = ComponentProps<typeof Command>;

export const PromptInputCommand = ({ className, ...props }: PromptInputCommandProps) => (
    <Command className={cn(className)} {...props} />
);

export type PromptInputCommandInputProps = ComponentProps<typeof CommandInput>;

export const PromptInputCommandInput = ({ className, ...props }: PromptInputCommandInputProps) => (
    <CommandInput className={cn(className)} {...props} />
);

export type PromptInputCommandListProps = ComponentProps<typeof CommandList>;

export const PromptInputCommandList = ({ className, ...props }: PromptInputCommandListProps) => (
    <CommandList className={cn(className)} {...props} />
);

export type PromptInputCommandEmptyProps = ComponentProps<typeof CommandEmpty>;

export const PromptInputCommandEmpty = ({ className, ...props }: PromptInputCommandEmptyProps) => (
    <CommandEmpty className={cn(className)} {...props} />
);

export type PromptInputCommandGroupProps = ComponentProps<typeof CommandGroup>;

export const PromptInputCommandGroup = ({ className, ...props }: PromptInputCommandGroupProps) => (
    <CommandGroup className={cn(className)} {...props} />
);

export type PromptInputCommandItemProps = ComponentProps<typeof CommandItem>;

export const PromptInputCommandItem = ({ className, ...props }: PromptInputCommandItemProps) => (
    <CommandItem className={cn(className)} {...props} />
);

export type PromptInputCommandSeparatorProps = ComponentProps<typeof CommandSeparator>;

export const PromptInputCommandSeparator = ({ className, ...props }: PromptInputCommandSeparatorProps) => (
    <CommandSeparator className={cn(className)} {...props} />
);
