/**
 * The eccenca color palette — single source of truth.
 *
 * Each ramp is exposed in three forms, all generated from this file (a jest
 * consistency test asserts they stay in sync):
 * - Tailwind theme tokens `--color-ecc-{ramp}-{weight}` in `src/tailwind/theme.css`,
 *   providing `bg-ecc-*` / `text-ecc-*` / `border-ecc-*` utilities,
 * - legacy `--eccgui-color-palette-{group}-{tint}-{weight}` aliases in
 *   `src/css/legacy-vars.css` (deprecated, removal planned for v28),
 * - this constant, for JS color logic (`colorHash`).
 *
 * Prefer the semantic tokens (`--primary`, `--brand`, `--destructive`, ...) for UI
 * states and chrome; use the ramp utilities only where a specific hue is the point
 * (graph nodes, tags, charts).
 */

export const COLOR_WEIGHTS = [100, 300, 500, 700, 900] as const;

export type ColorWeight = (typeof COLOR_WEIGHTS)[number];

export type PaletteGroup = "identity" | "semantic" | "layout" | "extra";

export interface PaletteRamp {
    /** Group in the legacy `--eccgui-color-palette-{group}-{tint}-{weight}` naming. */
    group: PaletteGroup;
    /** Tint in the legacy naming (differs from the ramp name for the identity ramps). */
    legacyTint: string;
    values: Record<ColorWeight, string>;
}

export const eccColorPalette = {
    orange: {
        group: "identity",
        legacyTint: "brand",
        values: { 100: "#fbead9", 300: "#f8cd99", 500: "#f6b966", 700: "#f4a533", 900: "#f29100" },
    },
    blue: {
        group: "identity",
        legacyTint: "accent",
        values: { 100: "#e5f4fb", 300: "#aecfe3", 500: "#77abca", 700: "#4186b2", 900: "#0a6199" },
    },
    foreground: {
        group: "identity",
        legacyTint: "text",
        values: { 100: "#fafafa", 300: "#d4d4d4", 500: "#737373", 700: "#252525", 900: "#0a0a0a" },
    },
    surface: {
        group: "identity",
        legacyTint: "background",
        values: { 100: "#fff", 300: "#f5f5f5", 500: "#e5e5e5", 700: "#d4d4d4", 900: "#a1a1a1" },
    },
    info: {
        group: "semantic",
        legacyTint: "info",
        values: { 100: "#e5f4fb", 300: "#aecfe3", 500: "#77aaca", 700: "#4086b2", 900: "#096199" },
    },
    success: {
        group: "semantic",
        legacyTint: "success",
        values: { 100: "#e8f5e9", 300: "#b1d4b7", 500: "#7ab286", 700: "#429154", 900: "#0b6f22" },
    },
    warning: {
        group: "semantic",
        legacyTint: "warning",
        values: { 100: "#fff3e0", 300: "#fad2b3", 500: "#f5b287", 700: "#f0915a", 900: "#eb702d" },
    },
    danger: {
        group: "semantic",
        legacyTint: "danger",
        values: { 100: "#fff5f6", 300: "#edbfc0", 500: "#db8989", 700: "#c95253", 900: "#b71c1c" },
    },
    yellow: {
        group: "layout",
        legacyTint: "yellow",
        values: { 100: "#fff6d5", 300: "#f1ecb5", 500: "#e3db79", 700: "#d4c93c", 900: "#a07d00" },
    },
    purple: {
        group: "layout",
        legacyTint: "purple",
        values: { 100: "#f8e9f7", 300: "#c8a2d1", 500: "#9d6eb8", 700: "#71378f", 900: "#370e59" },
    },
    magenta: {
        group: "layout",
        legacyTint: "magenta",
        values: { 100: "#ffeaf2", 300: "#f5a6c3", 500: "#e276a4", 700: "#be4c80", 900: "#8c1656" },
    },
    pink: {
        group: "layout",
        legacyTint: "pink",
        values: { 100: "#fde4f1", 300: "#e6b4ce", 500: "#d08aae", 700: "#bb5f8e", 900: "#711c4d" },
    },
    violet: {
        group: "layout",
        legacyTint: "violet",
        values: { 100: "#f4e3f4", 300: "#d8b0d8", 500: "#b377b3", 700: "#904490", 900: "#6e1f6e" },
    },
    indigo: {
        group: "layout",
        legacyTint: "indigo",
        values: { 100: "#efe4fb", 300: "#b89ee0", 500: "#8f72c5", 700: "#6547aa", 900: "#3b1e8f" },
    },
    petrol: {
        group: "layout",
        legacyTint: "petrol",
        values: { 100: "#e7eef2", 300: "#b0c8d4", 500: "#7aa2b5", 700: "#437c97", 900: "#0c5678" },
    },
    cyan: {
        group: "layout",
        legacyTint: "cyan",
        values: { 100: "#dff9fc", 300: "#86d6e5", 500: "#5abfd4", 700: "#2da9c4", 900: "#006a8f" },
    },
    teal: {
        group: "layout",
        legacyTint: "teal",
        values: { 100: "#dff4ef", 300: "#a3ddd3", 500: "#6dc0b2", 700: "#479d8d", 900: "#104c42" },
    },
    lime: {
        group: "layout",
        legacyTint: "lime",
        values: { 100: "#e4f3ea", 300: "#d2edd6", 500: "#9dcd99", 700: "#688a55", 900: "#5a7b2c" },
    },
    amber: {
        group: "layout",
        legacyTint: "amber",
        values: { 100: "#fff3d9", 300: "#ffe9c4", 500: "#f9cd8d", 700: "#eeb757", 900: "#c77400" },
    },
    vermilion: {
        group: "layout",
        legacyTint: "vermilion",
        values: { 100: "#ffe8e2", 300: "#f5b8a8", 500: "#d48772", 700: "#8c4b3a", 900: "#651c09" },
    },
    grey: {
        group: "layout",
        legacyTint: "grey",
        values: { 100: "#f5f5f5", 300: "#d4d4d4", 500: "#a1a1a1", 700: "#525252", 900: "#171717" },
    },
    gold: {
        group: "extra",
        legacyTint: "gold",
        values: { 100: "#fff7d5", 300: "#ebd893", 500: "#dfc670", 700: "#d3b44e", 900: "#c7a22b" },
    },
    silver: {
        group: "extra",
        legacyTint: "silver",
        values: { 100: "#f0f0f0", 300: "#dedede", 500: "#ccc", 700: "#bababa", 900: "#a8a8a8" },
    },
    bronze: {
        group: "extra",
        legacyTint: "bronze",
        values: { 100: "#fbe9db", 300: "#f2d6bc", 500: "#eac29d", 700: "#e1af7e", 900: "#d89b5f" },
    },
} as const satisfies Record<string, PaletteRamp>;

export type PaletteRampName = keyof typeof eccColorPalette;

/** Flat `[name, hexValue]` list in palette order, using the given naming scheme. */
export const listPaletteColors = (
    naming: "ecc" | "legacy" = "ecc",
    filter: { includePaletteGroup?: PaletteGroup[]; includeColorWeight?: ColorWeight[] } = {},
): [string, string][] => {
    const { includePaletteGroup, includeColorWeight } = filter;
    return (Object.entries(eccColorPalette) as [PaletteRampName, PaletteRamp][]).flatMap(([name, ramp]) => {
        if (includePaletteGroup && !includePaletteGroup.includes(ramp.group)) {
            return [];
        }
        return COLOR_WEIGHTS.filter((weight) => !includeColorWeight || includeColorWeight.includes(weight)).map(
            (weight): [string, string] => [
                naming === "ecc"
                    ? `color-ecc-${name}-${weight}`
                    : `eccgui-color-palette-${ramp.group}-${ramp.legacyTint}-${weight}`,
                ramp.values[weight],
            ],
        );
    });
};
