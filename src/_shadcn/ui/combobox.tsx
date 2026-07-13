/**
 * `combobox` — REBUILT for this library (NOT a direct port).
 *
 * The registry source (`radix-nova`) builds combobox on `@base-ui/react`, which is not a
 * dependency here. This is a faithful reimplementation of that component's PUBLIC API on our
 * Radix `Popover` + cmdk `Command` (the canonical pre-radix-nova shadcn combobox pattern), so
 * the app consumers port without edits. `React.forwardRef` is used per the library convention.
 *
 * Preserved public API (contract verified against the three app usage sites):
 *   Combobox        — root: items, value/onValueChange (string | null), open/onOpenChange,
 *                     onInputValueChange, filter (null | predicate), defaultValue/defaultOpen,
 *                     itemToStringLabel, disabled.
 *   ComboboxInput   — the always-visible field (the Popover anchor): showTrigger, showClear,
 *                     placeholder, disabled, className, children (leading addons) + input attrs.
 *   ComboboxContent — the dropdown (PopoverContent); accepts align/side/sideOffset overrides.
 *   ComboboxList    — render-prop over `items`: children = (item, index) => ReactNode.
 *   ComboboxItem    — value (string) + children; select on click / Enter.
 *   ComboboxEmpty   — shown when the visible list is empty.
 *   ComboboxGroup / ComboboxLabel / ComboboxSeparator — grouping helpers (Command-backed).
 *   useComboboxAnchor — retained for name-compat (see deviations).
 *
 * Deviations from the base-ui source (no Radix/Command equivalent):
 *   - Multi-select "chips" family (`ComboboxChips`, `ComboboxChip`, `ComboboxChipsInput`) and
 *     `ComboboxCollection`, `ComboboxValue`, `ComboboxTrigger` are NOT reimplemented — they rely
 *     on base-ui multi-select/anchor internals and are unused by any consumer.
 *   - Inline autocomplete/fuzzy filtering is replaced by the `filter` prop: `null` shows the
 *     caller-supplied `items` verbatim (external filtering — what all app sites do), a function
 *     is used as the predicate, and omitting it applies a case-insensitive substring match.
 *   - `useComboboxAnchor` returns a ref for name-compat but is a no-op: the Popover anchors to
 *     the input automatically, so no explicit anchor wiring is needed.
 */
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { ChevronDownIcon, XIcon } from "lucide-react";

import { cn } from "../../common/utils/cn";

import { Popover, PopoverAnchor, PopoverContent } from "./popover";
import { CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from "./command";

type ComboboxFilter<T> = (item: T, query: string) => boolean;

interface ComboboxContextValue {
    items: readonly unknown[];
    filter: ComboboxFilter<unknown> | null | undefined;
    itemToLabel: (item: unknown) => string;
    inputValue: string;
    selectedValue: string | null;
    open: boolean;
    disabled: boolean;
    anchorRef: React.MutableRefObject<HTMLDivElement | null>;
    setOpen: (open: boolean) => void;
    setInputValue: (value: string, emit?: boolean) => void;
    onSelect: (value: string) => void;
    onClear: () => void;
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useComboboxContext(component: string): ComboboxContextValue {
    const context = React.useContext(ComboboxContext);
    if (!context) {
        throw new Error(`<${component}> must be used within <Combobox>.`);
    }
    return context;
}

/**
 * Minimal controlled/uncontrolled state helper (a `null` prop counts as controlled; only
 * `undefined` selects the uncontrolled branch, so `value={null}` stays controlled).
 */
function useControllableState<T>(
    controlled: T | undefined,
    defaultValue: T,
    onChange?: (value: T) => void
): [T, (next: T) => void] {
    const [uncontrolled, setUncontrolled] = React.useState<T>(defaultValue);
    const isControlled = controlled !== undefined;
    const value = isControlled ? (controlled as T) : uncontrolled;

    const onChangeRef = React.useRef(onChange);
    React.useEffect(() => {
        onChangeRef.current = onChange;
    });

    const setValue = React.useCallback(
        (next: T) => {
            if (!isControlled) {
                setUncontrolled(next);
            }
            onChangeRef.current?.(next);
        },
        [isControlled]
    );

    return [value, setValue];
}

interface ComboboxProps<T> {
    children?: React.ReactNode;
    items?: readonly T[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onInputValueChange?: (value: string) => void;
    filter?: ComboboxFilter<T> | null;
    itemToStringLabel?: (item: T) => string;
    disabled?: boolean;
}

function Combobox<T = string>({
    children,
    items = [],
    value,
    defaultValue = null,
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onInputValueChange,
    filter,
    itemToStringLabel,
    disabled = false,
}: ComboboxProps<T>) {
    const [selectedValue, setSelectedValue] = useControllableState<string | null>(value, defaultValue, onValueChange);
    const [open, setOpen] = useControllableState<boolean>(openProp, defaultOpen, onOpenChange);
    const [inputValue, setInputValueState] = React.useState<string>(() => value ?? defaultValue ?? "");
    const anchorRef = React.useRef<HTMLDivElement | null>(null);

    const onInputValueChangeRef = React.useRef(onInputValueChange);
    React.useEffect(() => {
        onInputValueChangeRef.current = onInputValueChange;
    });

    const itemToLabel = React.useCallback(
        (item: unknown) => (itemToStringLabel ? itemToStringLabel(item as T) : String(item)),
        [itemToStringLabel]
    );

    // Keep the field text mirroring the selection while the popup is closed; leave it alone
    // while open so typed queries are not clobbered.
    React.useEffect(() => {
        if (!open) {
            setInputValueState(selectedValue ?? "");
        }
    }, [open, selectedValue]);

    const setInputValue = React.useCallback((next: string, emit = false) => {
        setInputValueState(next);
        if (emit) {
            onInputValueChangeRef.current?.(next);
        }
    }, []);

    const onSelect = React.useCallback(
        (next: string) => {
            setSelectedValue(next);
            setInputValueState(next);
            setOpen(false);
        },
        [setSelectedValue, setOpen]
    );

    const onClear = React.useCallback(() => {
        setSelectedValue(null);
        setInputValue("", true);
    }, [setSelectedValue, setInputValue]);

    const context = React.useMemo<ComboboxContextValue>(
        () => ({
            items: items as readonly unknown[],
            filter: filter as ComboboxFilter<unknown> | null | undefined,
            itemToLabel,
            inputValue,
            selectedValue,
            open,
            disabled,
            anchorRef,
            setOpen,
            setInputValue,
            onSelect,
            onClear,
        }),
        [items, filter, itemToLabel, inputValue, selectedValue, open, disabled, setOpen, setInputValue, onSelect, onClear]
    );

    return (
        <ComboboxContext.Provider value={context}>
            <CommandPrimitive data-slot="combobox" shouldFilter={false} className="contents">
                <Popover open={open} onOpenChange={setOpen}>
                    {children}
                </Popover>
            </CommandPrimitive>
        </ComboboxContext.Provider>
    );
}

interface ComboboxInputProps
    extends Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, "value" | "onValueChange"> {
    showTrigger?: boolean;
    showClear?: boolean;
    children?: React.ReactNode;
}

const ComboboxInput = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Input>, ComboboxInputProps>(
    ({ className, children, showTrigger = true, showClear = false, disabled: disabledProp, placeholder, onFocus, ...props }, ref) => {
        const context = useComboboxContext("ComboboxInput");
        const disabled = disabledProp ?? context.disabled;

        return (
            <PopoverAnchor asChild>
                <div
                    ref={context.anchorRef}
                    data-slot="combobox-input"
                    data-disabled={disabled || undefined}
                    className={cn(
                        "flex h-8 w-full items-center gap-1 rounded-lg border border-input bg-transparent px-2 text-sm transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-[3px] has-aria-invalid:ring-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 dark:bg-input/30",
                        className
                    )}
                >
                    {children}
                    <CommandPrimitive.Input
                        ref={ref}
                        data-slot="combobox-input-field"
                        disabled={disabled}
                        placeholder={placeholder}
                        {...props}
                        value={context.inputValue}
                        onValueChange={(next) => {
                            context.setInputValue(next, true);
                            context.setOpen(true);
                        }}
                        onFocus={(event) => {
                            context.setOpen(true);
                            event.currentTarget.select();
                            onFocus?.(event);
                        }}
                        className="flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed"
                    />
                    {showClear && context.selectedValue ? (
                        <button
                            type="button"
                            data-slot="combobox-clear"
                            aria-label="Clear"
                            disabled={disabled}
                            onClick={(event) => {
                                event.preventDefault();
                                context.onClear();
                            }}
                            className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground opacity-70 hover:opacity-100 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4"
                        >
                            <XIcon />
                        </button>
                    ) : showTrigger ? (
                        <button
                            type="button"
                            data-slot="combobox-trigger"
                            aria-label="Toggle suggestions"
                            tabIndex={-1}
                            disabled={disabled}
                            onClick={() => context.setOpen(!context.open)}
                            className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4"
                        >
                            <ChevronDownIcon />
                        </button>
                    ) : null}
                </div>
            </PopoverAnchor>
        );
    }
);
ComboboxInput.displayName = "ComboboxInput";

const ComboboxContent = React.forwardRef<
    React.ElementRef<typeof PopoverContent>,
    React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, align = "start", sideOffset = 6, onInteractOutside, ...props }, ref) => {
    const context = useComboboxContext("ComboboxContent");

    return (
        <PopoverContent
            ref={ref}
            data-slot="combobox-content"
            align={align}
            sideOffset={sideOffset}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
                const target = event.target as Node | null;
                // Interacting with the field itself (the anchor) must not dismiss the popup.
                if (target && context.anchorRef.current?.contains(target)) {
                    event.preventDefault();
                }
                onInteractOutside?.(event);
            }}
            className={cn(
                "w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width) overflow-hidden p-0",
                className
            )}
            {...props}
        >
            {children}
        </PopoverContent>
    );
});
ComboboxContent.displayName = "ComboboxContent";

interface ComboboxListProps<T> extends Omit<React.ComponentPropsWithoutRef<typeof CommandList>, "children"> {
    children: (item: T, index: number) => React.ReactNode;
}

function ComboboxList<T = string>({ children, ...props }: ComboboxListProps<T>) {
    const context = useComboboxContext("ComboboxList");

    const visibleItems = React.useMemo(() => {
        const list = context.items as readonly T[];
        if (context.filter === null) {
            return list;
        }
        const query = context.inputValue.trim();
        if (!query) {
            return list;
        }
        const predicate =
            (context.filter as ComboboxFilter<T> | undefined) ??
            ((item: T, q: string) => context.itemToLabel(item).toLowerCase().includes(q.toLowerCase()));
        return list.filter((item) => predicate(item, query));
    }, [context.items, context.filter, context.inputValue, context.itemToLabel]);

    return (
        <CommandList data-slot="combobox-list" {...props}>
            {visibleItems.map((item, index) => children(item, index))}
        </CommandList>
    );
}

interface ComboboxItemProps extends Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, "value" | "onSelect"> {
    value: string;
}

const ComboboxItem = React.forwardRef<React.ElementRef<typeof CommandItem>, ComboboxItemProps>(
    ({ value, className, children, ...props }, ref) => {
        const context = useComboboxContext("ComboboxItem");

        return (
            <CommandItem
                ref={ref}
                data-slot="combobox-item"
                value={value}
                data-checked={context.selectedValue === value ? "true" : undefined}
                onSelect={() => context.onSelect(value)}
                className={className}
                {...props}
            >
                {children}
            </CommandItem>
        );
    }
);
ComboboxItem.displayName = "ComboboxItem";

const ComboboxEmpty = React.forwardRef<
    React.ElementRef<typeof CommandEmpty>,
    React.ComponentPropsWithoutRef<typeof CommandEmpty>
>(({ className, ...props }, ref) => {
    return (
        <CommandEmpty
            ref={ref}
            data-slot="combobox-empty"
            className={cn("text-muted-foreground", className)}
            {...props}
        />
    );
});
ComboboxEmpty.displayName = "ComboboxEmpty";

const ComboboxGroup = React.forwardRef<
    React.ElementRef<typeof CommandGroup>,
    React.ComponentPropsWithoutRef<typeof CommandGroup>
>(({ ...props }, ref) => {
    return <CommandGroup ref={ref} data-slot="combobox-group" {...props} />;
});
ComboboxGroup.displayName = "ComboboxGroup";

const ComboboxLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                data-slot="combobox-label"
                className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
                {...props}
            />
        );
    }
);
ComboboxLabel.displayName = "ComboboxLabel";

const ComboboxSeparator = React.forwardRef<
    React.ElementRef<typeof CommandSeparator>,
    React.ComponentPropsWithoutRef<typeof CommandSeparator>
>(({ className, ...props }, ref) => {
    return <CommandSeparator ref={ref} data-slot="combobox-separator" className={cn("my-1", className)} {...props} />;
});
ComboboxSeparator.displayName = "ComboboxSeparator";

/**
 * Name-compat with the base-ui source. In this Popover-based implementation the popup anchors
 * to `<ComboboxInput>` automatically, so the returned ref does not need to be wired anywhere.
 */
function useComboboxAnchor() {
    return React.useRef<HTMLDivElement | null>(null);
}

export {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
    useComboboxAnchor,
};

export type { ComboboxFilter, ComboboxInputProps, ComboboxItemProps, ComboboxListProps, ComboboxProps };
