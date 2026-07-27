/**
 * Lightweight, unstyled-by-default building blocks for grouping composer suggestions
 * into labelled tab-like sections (used inside hover cards / command palettes).
 */
import type { HTMLAttributes } from "react";

import { cn } from "@/common/utils/cn";

export type PromptInputTabsListProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTabsList = ({ className, ...props }: PromptInputTabsListProps) => (
    <div className={cn(className)} {...props} />
);

export type PromptInputTabProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTab = ({ className, ...props }: PromptInputTabProps) => (
    <div className={cn(className)} {...props} />
);

export type PromptInputTabLabelProps = HTMLAttributes<HTMLHeadingElement>;

export const PromptInputTabLabel = ({ className, ...props }: PromptInputTabLabelProps) => (
    // Content provided via children in props
    // oxlint-disable-next-line eslint-plugin-jsx-a11y(heading-has-content)
    <h3 className={cn("mb-2 px-3 text-xs font-medium text-muted-foreground", className)} {...props} />
);

export type PromptInputTabBodyProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTabBody = ({ className, ...props }: PromptInputTabBodyProps) => (
    <div className={cn("space-y-1", className)} {...props} />
);

export type PromptInputTabItemProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTabItem = ({ className, ...props }: PromptInputTabItemProps) => (
    <div className={cn("flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent", className)} {...props} />
);
