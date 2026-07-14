import React from "react";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

type ColumnSpanPercent = "25%" | "50%" | "75%" | "100%";
type ColumnSpanSimple = boolean | number | ColumnSpanPercent;
interface ColumnSpanObject {
    span?: ColumnSpanSimple;
    offset?: number;
    start?: number;
    end?: number;
}
type ColumnSpan = ColumnSpanSimple | ColumnSpanObject;

/**
 * The five grid breakpoints and the number of columns each of them provides.
 * These column counts are what turn a span (e.g. `md: 2`) into a width (e.g. `2/8 = 25%`).
 * Breakpoints and column counts are fixed contracts — existing layouts depend on them.
 */
type GridBreakpoint = "sm" | "md" | "lg" | "xlg" | "max";
const BREAKPOINT_COLUMNS: Record<GridBreakpoint, number> = { sm: 4, md: 8, lg: 16, xlg: 16, max: 16 };
const BREAKPOINT_ORDER: GridBreakpoint[] = ["sm", "md", "lg", "xlg", "max"];

type GridSizeConfig = Partial<Record<GridBreakpoint, ColumnSpan>>;

/**
 * Responsive per-breakpoint widths for a sized column, driven by the `--eccgui-grid-col-{sm,md,lg,
 * xlg,max}` inline custom properties set below. The media queries encode the breakpoints
 * (md 42rem, lg 66rem, xlg 82rem, max 99rem; sm is the base); an unset breakpoint falls back to
 * `100%` (full width / stacked).
 */
const sizedWidthClassName = [
    "flex-[0_0_var(--eccgui-grid-col-sm,100%)] max-w-[var(--eccgui-grid-col-sm,100%)]",
    "[@media(min-width:42rem)]:flex-[0_0_var(--eccgui-grid-col-md,100%)] [@media(min-width:42rem)]:max-w-[var(--eccgui-grid-col-md,100%)]",
    "[@media(min-width:66rem)]:flex-[0_0_var(--eccgui-grid-col-lg,100%)] [@media(min-width:66rem)]:max-w-[var(--eccgui-grid-col-lg,100%)]",
    "[@media(min-width:82rem)]:flex-[0_0_var(--eccgui-grid-col-xlg,100%)] [@media(min-width:82rem)]:max-w-[var(--eccgui-grid-col-xlg,100%)]",
    "[@media(min-width:99rem)]:flex-[0_0_var(--eccgui-grid-col-max,100%)] [@media(min-width:99rem)]:max-w-[var(--eccgui-grid-col-max,100%)]",
].join(" ");

export interface GridColumnProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Column width is small, using 3 (or 2, on medium viewports) parts out of 16.
     * This boolean property is basically a quick switch for setting `{ md:2, lg:3 }`.
     */
    small?: boolean;
    /**
     * Column width is medium, using 5 (or 3, on medium viewports) parts out of 16.
     * This boolean property is basically a quick switch for setting `{ md:3, lg:5 }`.
     */
    medium?: boolean;
    /**
     * Alignment of column content.
     */
    verticalAlign?: "top" | "center";
    /**
     * Overwrite column sizes with an explicit per-breakpoint span config.
     *
     * v27: renamed from `carbonSizeConfig`.
     */
    sizeConfig?: GridSizeConfig;
}

/**
 * Turn a column span into a flex-basis percentage string for a given breakpoint
 * column count, or `undefined` when the span carries no explicit numeric width
 * (booleans and string percentages are never emitted as widths).
 */
const spanToWidth = (span: ColumnSpan | undefined, columns: number): string | undefined => {
    let value: number | undefined;
    if (typeof span === "number") {
        value = span;
    } else if (span && typeof span === "object" && typeof span.span === "number") {
        value = span.span;
    }
    if (value === undefined) {
        return undefined;
    }
    return `${(value / columns) * 100}%`;
};

/**
 * Grid columns can be used in grid rows.
 * They can contain other grids if this is necessary for more complex layouts.
 */
export const GridColumn = ({
    children,
    className = "",
    small = false,
    medium = false,
    verticalAlign = "top",
    sizeConfig,
    style,
    ...otherProps
}: GridColumnProps) => {
    // `small`/`medium` provide a preset span config, `medium` wins over `small`,
    // and an explicit `sizeConfig` overrides both.
    let presets: GridSizeConfig = {};
    if (small) presets = { md: 2, lg: 3 };
    if (medium) presets = { md: 3, lg: 5 };
    const resolvedSizeConfig: GridSizeConfig = { ...presets, ...sizeConfig };

    // Resolve the per-breakpoint widths into inline CSS custom properties, carrying the last
    // set breakpoint forward: a larger breakpoint keeps the previous width until it is
    // explicitly overridden (`min-width` cascade).
    const sizeVars: React.CSSProperties = {};
    let carried: string | undefined;
    BREAKPOINT_ORDER.forEach((breakpoint) => {
        const width = spanToWidth(resolvedSizeConfig[breakpoint], BREAKPOINT_COLUMNS[breakpoint]);
        if (width !== undefined) {
            carried = width;
        }
        if (carried !== undefined) {
            (sizeVars as Record<string, string>)[`--${eccgui}-grid-col-${breakpoint}`] = carried;
        }
    });
    const isSized = Object.keys(sizeVars).length > 0;

    return (
        <div
            {...otherProps}
            style={isSized ? { ...style, ...sizeVars } : style}
            className={cn(
                `${eccgui}-grid__column`,
                // min-w-0 keeps flex columns from growing to fit unbreakable text
                // (see https://css-tricks.com/flexbox-truncated-text/); px-2 = the gutter half.
                "relative min-w-0 px-2",
                // condensed gutter collapse (~1px) from an ancestor condensed grid / condensed row
                // (group-data from `Grid` / `GridRow`)
                "group-data-[condensed=true]/gridcondensed:p-[0.5px] group-data-[condensed=true]/rowcondensed:px-[0.5px]",
                isSized
                    ? // fixed proportional width, driven by the inline CSS vars set above
                      cn(`${eccgui}-grid__column--sized`, sizedWidthClassName)
                    : // no width set: equal-width, auto-growing column
                      "w-full max-w-full flex-1",
                `${eccgui}-grid__column--vertical-${verticalAlign}`,
                verticalAlign === "center" && "self-center",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default GridColumn;
