import React from "react";
import Color from "color";

import { ToggleGroup, ToggleGroupItem } from "@/_shadcn/ui/toggle-group";
import { cn } from "@/common/utils/cn";
import decideContrastColorValue from "@/common/utils/colorDecideContrastvalue";
import { TestableComponent } from "@/components/interfaces";

export interface FilterChipItem {
    /** Unique id of the chip; passed to `onChange` when the chip is selected. */
    id: string;
    /** Chip label. */
    label: React.ReactNode;
    /** Optional leading element, e.g. an `<Icon />`. */
    icon?: React.ReactNode;
    /**
     * Optional fill color applied to the chip while it is the selected one. A readable
     * text color is derived automatically. Invalid color values fall back to the neutral
     * selected style.
     */
    activeColor?: string;
}

export interface FilterChipsProps extends TestableComponent {
    /** The chips to display (order defines display order). */
    chips: FilterChipItem[];
    /** Id of the currently selected chip. Exactly one chip is always selected. */
    selectedChipId: string;
    /** Called with the chip id when another chip is selected. */
    onChange: (chipId: string) => void;
    /** Additional CSS class name for the chip group. */
    className?: string;
}

/**
 * Single-select, wrapping group of small filter chips, e.g. to switch between filter
 * categories above a list. Exactly one chip stays selected: clicking the selected chip
 * again does not deselect it. A chip's `activeColor` tints it while selected so it can
 * match color-coded content (tags, canvas nodes) it filters for.
 */
export const FilterChips = ({ chips, selectedChipId, onChange, className, ...otherProps }: FilterChipsProps) => {
    return (
        <ToggleGroup
            type="single"
            value={selectedChipId}
            // Radix allows deselecting the active item (empty value); exactly one chip
            // must stay selected, so that case is ignored.
            onValueChange={(value: string) => {
                if (value) onChange(value);
            }}
            className={cn("w-full flex-wrap justify-start gap-1", className)}
            data-test-id={otherProps["data-test-id"]}
            data-testid={otherProps["data-testid"]}
        >
            {chips.map((chip) => {
                // The selected chip is filled with its `activeColor`; the readable text color
                // is derived the same way the Tag pills do it. Unselected chips stay uniform
                // outlines (no inline style).
                let activeStyle: React.CSSProperties | undefined;
                if (chip.activeColor && chip.id === selectedChipId) {
                    try {
                        const bg = Color(chip.activeColor).rgb().toString();
                        activeStyle = {
                            backgroundColor: bg,
                            borderColor: bg,
                            color: decideContrastColorValue({ testColor: chip.activeColor }),
                        };
                    } catch {
                        // invalid color configuration: fall back to the neutral selected style
                    }
                }
                return (
                    <ToggleGroupItem
                        key={chip.id}
                        value={chip.id}
                        style={activeStyle}
                        className={
                            "h-6 min-w-0 gap-1 rounded-md border border-input bg-background px-2 text-xs font-medium text-muted-foreground transition-colors " +
                            "outline-none hover:bg-accent/70 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 " +
                            "data-[state=on]:border-transparent data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
                        }
                    >
                        {chip.icon ?? null}
                        {chip.label}
                    </ToggleGroupItem>
                );
            })}
        </ToggleGroup>
    );
};

export default FilterChips;
