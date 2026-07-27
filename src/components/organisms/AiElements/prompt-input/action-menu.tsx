/**
 * Dropdown-menu wiring for the composer's "add" / overflow actions. The trigger reuses
 * {@link PromptInputButton}; concrete side-effecting items live in `./attachments`.
 */
import type { ComponentProps } from "react";
import { PlusIcon } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/_shadcn/ui/dropdown-menu";
import { cn } from "@/common/utils/cn";

import { PromptInputButton, PromptInputButtonProps } from "./button";

export type PromptInputActionMenuProps = ComponentProps<typeof DropdownMenu>;
export const PromptInputActionMenu = (props: PromptInputActionMenuProps) => <DropdownMenu {...props} />;

export type PromptInputActionMenuTriggerProps = PromptInputButtonProps;

export const PromptInputActionMenuTrigger = ({ className, children, ...props }: PromptInputActionMenuTriggerProps) => (
    <DropdownMenuTrigger asChild>
        <PromptInputButton className={className} {...props}>
            {children ?? <PlusIcon className="size-4" />}
        </PromptInputButton>
    </DropdownMenuTrigger>
);

export type PromptInputActionMenuContentProps = ComponentProps<typeof DropdownMenuContent>;
export const PromptInputActionMenuContent = ({ className, ...props }: PromptInputActionMenuContentProps) => (
    <DropdownMenuContent align="start" className={cn(className)} {...props} />
);

export type PromptInputActionMenuItemProps = ComponentProps<typeof DropdownMenuItem>;
export const PromptInputActionMenuItem = ({ className, ...props }: PromptInputActionMenuItemProps) => (
    <DropdownMenuItem className={cn(className)} {...props} />
);
