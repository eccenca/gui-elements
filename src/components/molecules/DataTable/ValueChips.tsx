
import { Badge } from "@/_shadcn/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/_shadcn/ui/tooltip";

export interface ValueChipsProps {
    values: string[];
    /** Maximum number of chips rendered before collapsing into a "+N" badge. */
    limit?: number;
    /** Label rendered for empty-string values. English default; pass a translation to localize. */
    emptyLabel?: string;
}

/**
 * Renders a list of values as small pills, capped at `limit` with a trailing
 * "+N" badge whose tooltip lists the overflow — so a large multi-value cell
 * (e.g. a split result) can't blow out the row height.
 */
export function ValueChips({ values, limit = 8, emptyLabel = "empty" }: ValueChipsProps) {
    const shown = values.slice(0, limit);
    const overflow = values.slice(limit);
    return (
        <span className="flex flex-col items-start gap-1">
            {shown.map((value, i) => (
                <Badge
                    key={i}
                    variant="secondary"
                    className="h-auto rounded border-0 bg-muted px-1.5 py-0.5 text-[10px] font-normal text-foreground/80"
                >
                    {value === "" ? <span className="text-muted-foreground/50 italic">{emptyLabel}</span> : value}
                </Badge>
            ))}
            {overflow.length > 0 ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge
                                variant="secondary"
                                className="h-auto cursor-default rounded border-0 bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                            >
                                {`+${overflow.length}`}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs break-all">{overflow.join(", ")}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : null}
        </span>
    );
}
