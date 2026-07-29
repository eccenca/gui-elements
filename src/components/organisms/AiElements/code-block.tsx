/**
 * Port of the vendored ai-elements `code-block` (source: mapping-creator-2
 * `components/ai-elements/code-block.tsx`) behind the SAME component interface
 * (Container/Header/Title/Filename/Actions/Content/CodeBlock/CopyButton).
 * The original used shiki, which is `exports`-only ESM with wasm assets — not
 * loadable under webpack 4 — so highlighting runs on react-syntax-highlighter's
 * Prism/refractor build instead (CJS, already bundled via `cmem/markdown`).
 * Tokens render as classes (`useInlineStyles={false}`) and are colored by the
 * `--syntax-*` theme tokens (see tailwind/base.css), so light/dark theming
 * follows the app. Unregistered languages (e.g. "plaintext") fall back to
 * unhighlighted text. Used by the (non-AI) turtle output card and the chat
 * message/tool renderers.
 */
import type { ComponentProps, HTMLAttributes } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/_shadcn/ui/button";
import { cn } from "@/common/utils/cn";

const CodeBlockContext = createContext<{ code: string }>({ code: "" });

export const CodeBlockContainer = ({
    className,
    language,
    style,
    ...props
}: HTMLAttributes<HTMLDivElement> & { language: string }) => (
    <div
        className={cn(
            "group relative w-full overflow-hidden rounded-md border bg-background text-foreground",
            className,
        )}
        data-language={language}
        style={{
            containIntrinsicSize: "auto 200px",
            contentVisibility: "auto",
            ...style,
        }}
        {...props}
    />
);

export const CodeBlockHeader = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex items-center justify-between border-b bg-muted/80 px-3 py-2 text-muted-foreground text-xs",
            className,
        )}
        {...props}
    >
        {children}
    </div>
);

export const CodeBlockTitle = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex items-center gap-2", className)} {...props}>
        {children}
    </div>
);

export const CodeBlockFilename = ({ children, className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
    <span className={cn("font-mono", className)} {...props}>
        {children}
    </span>
);

export const CodeBlockActions = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("-my-1 -mr-1 flex items-center gap-2", className)} {...props}>
        {children}
    </div>
);

export const CodeBlockContent = ({
    code,
    language,
    showLineNumbers = false,
}: {
    code: string;
    language: string;
    showLineNumbers?: boolean;
}) => (
    <div className="eccgui-codeblock relative overflow-auto">
        <SyntaxHighlighter
            language={language}
            useInlineStyles={false}
            showLineNumbers={showLineNumbers}
            className="m-0 w-full p-3 font-mono text-xs leading-5"
        >
            {code}
        </SyntaxHighlighter>
    </div>
);

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
    code: string;
    language: string;
    showLineNumbers?: boolean;
};

export const CodeBlock = ({
    code,
    language,
    showLineNumbers = false,
    className,
    children,
    ...props
}: CodeBlockProps) => {
    // Non-string code (e.g. JSON.stringify of undefined) must not throw and
    // white-screen the surrounding view — same guard as the source.
    const safeCode = typeof code === "string" ? code : String(code ?? "");
    const contextValue = useMemo(() => ({ code: safeCode }), [safeCode]);

    return (
        <CodeBlockContext.Provider value={contextValue}>
            <CodeBlockContainer className={className} language={language} {...props}>
                {children}
                <CodeBlockContent code={safeCode} language={language} showLineNumbers={showLineNumbers} />
            </CodeBlockContainer>
        </CodeBlockContext.Provider>
    );
};

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
    onCopy?: () => void;
    onError?: (error: Error) => void;
    timeout?: number;
};

export const CodeBlockCopyButton = ({
    onCopy,
    onError,
    timeout = 2000,
    children,
    className,
    ...props
}: CodeBlockCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number>(0);
    const { code } = useContext(CodeBlockContext);

    const copyToClipboard = useCallback(async () => {
        if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
            onError?.(new Error("Clipboard API not available"));
            return;
        }
        try {
            if (!isCopied) {
                await navigator.clipboard.writeText(code);
                setIsCopied(true);
                onCopy?.();
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = window.setTimeout(() => setIsCopied(false), timeout);
            }
        } catch (error) {
            onError?.(error as Error);
        }
    }, [code, isCopied, onCopy, onError, timeout]);

    // Clear the pending "copied" reset on unmount so it can't fire setState on an
    // unmounted component (e.g. when the code block scrolls out / the card closes
    // within the 2s window).
    useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

    const Icon = isCopied ? CheckIcon : CopyIcon;

    return (
        <Button
            className={cn("shrink-0", className)}
            onClick={copyToClipboard}
            size="icon-sm"
            variant="ghost"
            {...props}
        >
            {children ?? <Icon className="size-4" />}
        </Button>
    );
};
