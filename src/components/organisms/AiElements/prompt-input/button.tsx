/**
 * A composer toolbar button (ghost `InputGroupButton`) with an optional tooltip that
 * supports a plain string or a `{ content, shortcut, side }` descriptor.
 */
import type { ComponentProps, ReactNode } from "react";
import { Children } from "react";

import { InputGroupButton } from "@/_shadcn/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/_shadcn/ui/tooltip";
import { cn } from "@/common/utils/cn";

export type PromptInputButtonTooltip =
    | string
    | {
          content: ReactNode;
          shortcut?: string;
          side?: ComponentProps<typeof TooltipContent>["side"];
      };

export type PromptInputButtonProps = ComponentProps<typeof InputGroupButton> & {
    tooltip?: PromptInputButtonTooltip;
};

export const PromptInputButton = ({
    variant = "ghost",
    className,
    size,
    tooltip,
    ...props
}: PromptInputButtonProps) => {
    const newSize = size ?? (Children.count(props.children) > 1 ? "sm" : "icon-sm");

    const button = (
        <InputGroupButton className={cn(className)} size={newSize} type="button" variant={variant} {...props} />
    );

    if (!tooltip) {
        return button;
    }

    const tooltipContent = typeof tooltip === "string" ? tooltip : tooltip.content;
    const shortcut = typeof tooltip === "string" ? undefined : tooltip.shortcut;
    const side = typeof tooltip === "string" ? "top" : (tooltip.side ?? "top");

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side={side}>
                {tooltipContent}
                {shortcut && <span className="ml-2 text-muted-foreground">{shortcut}</span>}
            </TooltipContent>
        </Tooltip>
    );
};
