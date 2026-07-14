/**
 * Vendored ai-elements `message` (source: mapping-creator-2
 * components/ai-elements/message.tsx).
 *
 * PORT NOTES:
 * - The Vercel AI SDK (`ai`) is not a dependency of this wave, so its
 *   `UIMessage` type is replaced by the local structural mirror in `./types`
 *   (only `UIMessage["role"]` is read here).
 * - streamdown / @streamdown/* / shiki are webpack-4-hostile and unavailable,
 *   so `MessageResponse` renders through `react-markdown` (a hoisted dep already
 *   used elsewhere in this plugin) + `remark-gfm` (tables / strikethrough, which
 *   streamdown supported out of the box). The component's props (`children`,
 *   `className`, `isAnimating`) and wrapper styling are preserved; fenced code
 *   blocks route to the shared shiki-less `./code-block`. The @streamdown
 *   `cjk` / `math` / `mermaid` plugins have no webpack-4 substitute and are
 *   dropped.
 */
import type { ComponentProps, HTMLAttributes, ReactElement } from "react";
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import remarkGfm from "remark-gfm";

import { Button } from "@/_shadcn/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/_shadcn/ui/button-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/_shadcn/ui/tooltip";
import { cn } from "@/common/utils/cn";

import { CodeBlock } from "./code-block";
import type { UIMessage } from "./types";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
    from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
    <div
        className={cn(
            "group flex w-full max-w-[95%] flex-col gap-2",
            from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
            className,
        )}
        {...props}
    />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({ children, className, ...props }: MessageContentProps) => (
    <div
        className={cn(
            "is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm",
            "group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
            "group-[.is-assistant]:text-foreground",
            className,
        )}
        {...props}
    >
        {children}
    </div>
);

export type MessageActionsProps = ComponentProps<"div">;

export const MessageActions = ({ className, children, ...props }: MessageActionsProps) => (
    <div className={cn("flex items-center gap-1", className)} {...props}>
        {children}
    </div>
);

export type MessageActionProps = ComponentProps<typeof Button> & {
    tooltip?: string;
    label?: string;
};

export const MessageAction = ({
    tooltip,
    children,
    label,
    variant = "ghost",
    size = "icon-sm",
    ...props
}: MessageActionProps) => {
    const button = (
        <Button size={size} type="button" variant={variant} {...props}>
            {children}
            <span className="sr-only">{label || tooltip}</span>
        </Button>
    );

    if (tooltip) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return button;
};

interface MessageBranchContextType {
    currentBranch: number;
    totalBranches: number;
    goToPrevious: () => void;
    goToNext: () => void;
    branches: ReactElement[];
    setBranches: (branches: ReactElement[]) => void;
}

const MessageBranchContext = createContext<MessageBranchContextType | null>(null);

const useMessageBranch = () => {
    const context = useContext(MessageBranchContext);

    if (!context) {
        throw new Error("MessageBranch components must be used within MessageBranch");
    }

    return context;
};

export type MessageBranchProps = HTMLAttributes<HTMLDivElement> & {
    defaultBranch?: number;
    onBranchChange?: (branchIndex: number) => void;
};

export const MessageBranch = ({ defaultBranch = 0, onBranchChange, className, ...props }: MessageBranchProps) => {
    const [currentBranch, setCurrentBranch] = useState(defaultBranch);
    const [branches, setBranches] = useState<ReactElement[]>([]);

    const handleBranchChange = useCallback(
        (newBranch: number) => {
            setCurrentBranch(newBranch);
            onBranchChange?.(newBranch);
        },
        [onBranchChange],
    );

    const goToPrevious = useCallback(() => {
        const newBranch = currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
        handleBranchChange(newBranch);
    }, [currentBranch, branches.length, handleBranchChange]);

    const goToNext = useCallback(() => {
        const newBranch = currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
        handleBranchChange(newBranch);
    }, [currentBranch, branches.length, handleBranchChange]);

    const contextValue = useMemo<MessageBranchContextType>(
        () => ({
            branches,
            currentBranch,
            goToNext,
            goToPrevious,
            setBranches,
            totalBranches: branches.length,
        }),
        [branches, currentBranch, goToNext, goToPrevious],
    );

    return (
        <MessageBranchContext.Provider value={contextValue}>
            <div className={cn("grid w-full gap-2 [&>div]:pb-0", className)} {...props} />
        </MessageBranchContext.Provider>
    );
};

export type MessageBranchContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageBranchContent = ({ children, ...props }: MessageBranchContentProps) => {
    const { currentBranch, setBranches, branches } = useMessageBranch();
    const childrenArray = useMemo(() => (Array.isArray(children) ? children : [children]), [children]);

    // Use useEffect to update branches when they change
    useEffect(() => {
        if (branches.length !== childrenArray.length) {
            setBranches(childrenArray);
        }
    }, [childrenArray, branches, setBranches]);

    return childrenArray.map((branch, index) => (
        <div
            className={cn("grid gap-2 overflow-hidden [&>div]:pb-0", index === currentBranch ? "block" : "hidden")}
            key={branch.key}
            {...props}
        >
            {branch}
        </div>
    ));
};

export type MessageBranchSelectorProps = ComponentProps<typeof ButtonGroup>;

export const MessageBranchSelector = ({ className, ...props }: MessageBranchSelectorProps) => {
    const { totalBranches } = useMessageBranch();

    // Don't render if there's only one branch
    if (totalBranches <= 1) {
        return null;
    }

    return (
        <ButtonGroup
            className={cn("[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md", className)}
            orientation="horizontal"
            {...props}
        />
    );
};

export type MessageBranchPreviousProps = ComponentProps<typeof Button>;

export const MessageBranchPrevious = ({ children, ...props }: MessageBranchPreviousProps) => {
    const { goToPrevious, totalBranches } = useMessageBranch();

    return (
        <Button
            aria-label="Previous branch"
            disabled={totalBranches <= 1}
            onClick={goToPrevious}
            size="icon-sm"
            type="button"
            variant="ghost"
            {...props}
        >
            {children ?? <ChevronLeftIcon size={14} />}
        </Button>
    );
};

export type MessageBranchNextProps = ComponentProps<typeof Button>;

export const MessageBranchNext = ({ children, ...props }: MessageBranchNextProps) => {
    const { goToNext, totalBranches } = useMessageBranch();

    return (
        <Button
            aria-label="Next branch"
            disabled={totalBranches <= 1}
            onClick={goToNext}
            size="icon-sm"
            type="button"
            variant="ghost"
            {...props}
        >
            {children ?? <ChevronRightIcon size={14} />}
        </Button>
    );
};

export type MessageBranchPageProps = HTMLAttributes<HTMLSpanElement>;

export const MessageBranchPage = ({ className, ...props }: MessageBranchPageProps) => {
    const { currentBranch, totalBranches } = useMessageBranch();

    return (
        <ButtonGroupText
            className={cn("border-none bg-transparent text-muted-foreground shadow-none", className)}
            {...props}
        >
            {currentBranch + 1} of {totalBranches}
        </ButtonGroupText>
    );
};

export type MessageResponseProps = ComponentProps<typeof ReactMarkdown> & {
    /** Extra classes for the wrapper (streamdown accepted a `className`). */
    className?: string;
    /**
     * Retained from the streamdown API purely for the memo comparison below; it
     * is a render hint and is NOT forwarded to react-markdown.
     */
    isAnimating?: boolean;
};

// Route fenced code blocks through the shared shiki-less CodeBlock and render
// inline code as a plain <code>. `pre` is unwrapped so CodeBlock (a <div>) is
// never nested inside a <pre>.
const markdownComponents: Components = {
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className ?? "");
        if (match) {
            return <CodeBlock code={String(children ?? "").replace(/\n$/, "")} language={match[1]} />;
        }
        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    },
};

export const MessageResponse = memo(
    ({ className, isAnimating: _isAnimating, children, components, remarkPlugins, ...props }: MessageResponseProps) => (
        <div className={cn("size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)}>
            <ReactMarkdown
                components={{ ...markdownComponents, ...components }}
                remarkPlugins={[remarkGfm, ...(remarkPlugins ?? [])]}
                {...props}
            >
                {typeof children === "string" ? children : ""}
            </ReactMarkdown>
        </div>
    ),
    (prevProps, nextProps) =>
        prevProps.children === nextProps.children && nextProps.isAnimating === prevProps.isAnimating,
);

MessageResponse.displayName = "MessageResponse";

export type MessageToolbarProps = ComponentProps<"div">;

export const MessageToolbar = ({ className, children, ...props }: MessageToolbarProps) => (
    <div className={cn("mt-4 flex w-full items-center justify-between gap-4", className)} {...props}>
        {children}
    </div>
);
