/**
 * Vendored ai-elements `tool` (source: mapping-creator-2
 * components/ai-elements/tool.tsx).
 *
 * PORT NOTE: the Vercel AI SDK (`ai`) is not a dependency of this wave, so its
 * `ToolUIPart` / `DynamicToolUIPart` types are replaced by the local structural
 * mirrors in `./types`. Tool input/output render through the pre-existing
 * shiki-less `./code-block`.
 */
import type { ComponentProps, ReactNode } from "react";
import { isValidElement } from "react";
import { CheckCircleIcon, ChevronDownIcon, CircleIcon, ClockIcon, WrenchIcon, XCircleIcon } from "lucide-react";

import { Badge } from "@/_shadcn/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/_shadcn/ui/collapsible";
import { cn } from "@/common/utils/cn";

import { CodeBlock } from "./code-block";
import type { DynamicToolUIPart, ToolUIPart } from "./types";

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
    <Collapsible className={cn("group not-prose mb-4 w-full rounded-md border", className)} {...props} />
);

export type ToolPart = ToolUIPart | DynamicToolUIPart;

/**
 * Overridable, per-state status badge labels. Every user-visible string in this
 * component is an English default overridable via props (per the kit contract in
 * `./index.ts`). Pass a partial map to translate only the states you use.
 */
export type ToolStatusLabels = Record<ToolPart["state"], string>;

export type ToolHeaderProps = {
    title?: string;
    className?: string;
    /** Override the status badge labels; unspecified states keep the English default. */
    statusLabels?: Partial<ToolStatusLabels>;
} & (
    | { type: ToolUIPart["type"]; state: ToolUIPart["state"]; toolName?: never }
    | {
          type: DynamicToolUIPart["type"];
          state: DynamicToolUIPart["state"];
          toolName: string;
      }
);

/** English defaults for the status badge labels. */
export const defaultToolStatusLabels: ToolStatusLabels = {
    "approval-requested": "Awaiting Approval",
    "approval-responded": "Responded",
    "input-available": "Running",
    "input-streaming": "Pending",
    "output-available": "Completed",
    "output-denied": "Denied",
    "output-error": "Error",
};

const statusIcons: Record<ToolPart["state"], ReactNode> = {
    "approval-requested": <ClockIcon className="size-4 text-warning" />,
    "approval-responded": <CheckCircleIcon className="size-4 text-info" />,
    "input-available": <ClockIcon className="size-4 animate-pulse" />,
    "input-streaming": <CircleIcon className="size-4" />,
    "output-available": <CheckCircleIcon className="size-4 text-success" />,
    "output-denied": <XCircleIcon className="size-4 text-warning" />,
    "output-error": <XCircleIcon className="size-4 text-destructive" />,
};

export const getStatusBadge = (status: ToolPart["state"], statusLabels?: Partial<ToolStatusLabels>) => (
    <Badge className="gap-1.5 rounded-full text-xs" variant="secondary">
        {statusIcons[status]}
        {statusLabels?.[status] ?? defaultToolStatusLabels[status]}
    </Badge>
);

export const ToolHeader = ({ className, title, type, state, toolName, statusLabels, ...props }: ToolHeaderProps) => {
    const derivedName = type === "dynamic-tool" ? toolName : type.split("-").slice(1).join("-");

    return (
        <CollapsibleTrigger className={cn("flex w-full items-center justify-between gap-4 p-3", className)} {...props}>
            <div className="flex items-center gap-2">
                <WrenchIcon className="size-4 text-muted-foreground" />
                <span className="font-medium text-sm">{title ?? derivedName}</span>
                {getStatusBadge(state, statusLabels)}
            </div>
            <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
    );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
    <CollapsibleContent
        className={cn(
            "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 space-y-4 p-4 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
            className,
        )}
        {...props}
    />
);

export type ToolInputProps = ComponentProps<"div"> & {
    input: ToolPart["input"];
    /** Heading above the parameters block. @default "Parameters" */
    parametersLabel?: string;
};

export const ToolInput = ({ className, input, parametersLabel = "Parameters", ...props }: ToolInputProps) => (
    <div className={cn("space-y-2 overflow-hidden", className)} {...props}>
        <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">{parametersLabel}</h4>
        <div className="rounded-md bg-muted/50">
            <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
        </div>
    </div>
);

export type ToolOutputProps = ComponentProps<"div"> & {
    output: ToolPart["output"];
    errorText: ToolPart["errorText"];
    /** Heading shown when `errorText` is present. @default "Error" */
    errorLabel?: string;
    /** Heading shown for a successful result. @default "Result" */
    resultLabel?: string;
};

export const ToolOutput = ({
    className,
    output,
    errorText,
    errorLabel = "Error",
    resultLabel = "Result",
    ...props
}: ToolOutputProps) => {
    if (!(output || errorText)) {
        return null;
    }

    let Output = <div>{output as ReactNode}</div>;

    if (typeof output === "object" && !isValidElement(output)) {
        Output = <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />;
    } else if (typeof output === "string") {
        Output = <CodeBlock code={output} language="json" />;
    }

    return (
        <div className={cn("space-y-2", className)} {...props}>
            <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                {errorText ? errorLabel : resultLabel}
            </h4>
            <div
                className={cn(
                    "overflow-x-auto rounded-md text-xs [&_table]:w-full",
                    errorText ? "bg-destructive/10 text-destructive" : "bg-muted/50 text-foreground",
                )}
            >
                {errorText && <div>{errorText}</div>}
                {Output}
            </div>
        </div>
    );
};
