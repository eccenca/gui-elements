import React from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/**
 * Column span shape, mirroring the former `@carbon/react` grid column span type so the
 * public `carbonSizeConfig` / `span` API stays unchanged after dropping the Carbon import.
 */
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
 * The five Carbon 2x-grid breakpoints and the number of columns each of them provides.
 * These column counts are what turn a span (e.g. `md: 2`) into a width (e.g. `2/8 = 25%`).
 */
type CarbonBreakpoint = "sm" | "md" | "lg" | "xlg" | "max";
const BREAKPOINT_COLUMNS: Record<CarbonBreakpoint, number> = { sm: 4, md: 8, lg: 16, xlg: 16, max: 16 };
const BREAKPOINT_ORDER: CarbonBreakpoint[] = ["sm", "md", "lg", "xlg", "max"];

type CarbonSizeConfig = Partial<Record<CarbonBreakpoint, ColumnSpan>>;

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
     * Overwrite column sizes by using the original size config of the Carbon grid column.
     */
    carbonSizeConfig?: CarbonSizeConfig;
    /**
     * Constant column span. Kept for API compatibility; the flexbox grid ignores it
     * (exactly as the underlying Carbon FlexGrid column did).
     */
    span?: ColumnSpan;
}

/**
 * Turn a Carbon column span into a flex-basis percentage string for a given breakpoint
 * column count, or `undefined` when the span carries no explicit numeric width (booleans
 * and string percentages were never emitted as widths by the Carbon flexbox grid).
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
    carbonSizeConfig,
    span, // eslint-disable-line @typescript-eslint/no-unused-vars -- stripped: the flexbox grid ignores a constant span
    style,
    ...otherProps
}: GridColumnProps) => {
    // Mirrors the previous wrapper precedence: `small`/`medium` provide a preset span
    // config, `medium` wins over `small`, and an explicit `carbonSizeConfig` overrides both.
    let presets: CarbonSizeConfig = {};
    if (small) presets = { md: 2, lg: 3 };
    if (medium) presets = { md: 3, lg: 5 };
    const sizeConfig: CarbonSizeConfig = { ...presets, ...carbonSizeConfig };

    // Resolve the per-breakpoint widths into inline CSS custom properties, carrying the last
    // set breakpoint forward. This reproduces Carbon's `min-width` cascade (a larger breakpoint
    // keeps the previous width until it is explicitly overridden) and lets `grid.scss` apply the
    // widths at Carbon's exact breakpoints without needing statically known Tailwind classes.
    const sizeVars: React.CSSProperties = {};
    let carried: string | undefined;
    BREAKPOINT_ORDER.forEach((breakpoint) => {
        const width = spanToWidth(sizeConfig[breakpoint], BREAKPOINT_COLUMNS[breakpoint]);
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
                isSized
                    ? // fixed proportional width, driven by the CSS vars above (see grid.scss)
                      `${eccgui}-grid__column--sized`
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
