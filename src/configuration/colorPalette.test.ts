import fs from "fs";
import path from "path";

import { COLOR_WEIGHTS, eccColorPalette, listPaletteColors } from "./colorPalette";

/**
 * Converts an sRGB hex color to CSS `oklch()` component values, using the reference
 * sRGB -> linear -> LMS -> OKLab -> OKLCH pipeline (Björn Ottosson's OKLab, the same
 * color space Tailwind v4 / shadcn ship their tokens in). Used below to check that the
 * semantic tokens documented as "derived from" a given eccenca palette hex in
 * `theme.css` really are that hex, converted.
 */
const hexToOklch = (hex: string): { l: number; c: number; h: number } => {
    const int = parseInt(hex.replace("#", ""), 16);
    const srgbToLinear = (channel: number) => {
        const c = channel / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const r = srgbToLinear((int >> 16) & 255);
    const g = srgbToLinear((int >> 8) & 255);
    const b = srgbToLinear(int & 255);

    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    const c = Math.sqrt(A * A + B * B);
    let h = (Math.atan2(B, A) * 180) / Math.PI;
    if (h < 0) h += 360;
    return { l: L, c, h };
};

/** Parses a CSS `oklch(L C H)` (optionally `/ alpha%`) literal into numeric components. */
const parseOklch = (value: string): { l: number; c: number; h: number; alpha?: number } => {
    const match = value.trim().match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)%)?\s*\)$/);
    if (!match) {
        throw new Error(`not an oklch() literal: ${value}`);
    }
    const [, l, c, h, alpha] = match;
    return { l: Number(l), c: Number(c), h: Number(h), alpha: alpha === undefined ? undefined : Number(alpha) };
};

/** Extracts the `--custom-property: value;` declarations of a single flat (non-nested) CSS block. */
const parseCssBlock = (css: string, selectorPattern: string): Record<string, string> => {
    const blockMatch = css.match(new RegExp(`(?:^|\\n)${selectorPattern}\\s*{([^}]*)}`));
    if (!blockMatch) {
        throw new Error(`block matching /${selectorPattern}/ not found`);
    }
    return Object.fromEntries(
        [...blockMatch[1].matchAll(/(--[a-zA-Z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
    );
};

/**
 * The palette exists in three generated forms; `src/configuration/colorPalette.ts`
 * is the source of truth. These tests fail whenever one of the CSS artifacts
 * drifts from the TS constant.
 */
describe("eccenca color palette consistency", () => {
    const expectedTokenCount = Object.keys(eccColorPalette).length * COLOR_WEIGHTS.length;

    it("exposes every ramp in all weights via listPaletteColors", () => {
        expect(listPaletteColors("ecc")).toHaveLength(expectedTokenCount);
        expect(listPaletteColors("legacy")).toHaveLength(expectedTokenCount);
    });

    it("matches the Tailwind theme tokens in src/tailwind/theme.css", () => {
        const themeCss = fs.readFileSync(path.join(__dirname, "../tailwind/theme.css"), "utf8");
        const tokens = Object.fromEntries(
            [...themeCss.matchAll(/--color-ecc-([a-z]+)-(\d+):\s*(#[0-9a-fA-F]+);/g)].map((m) => [
                `color-ecc-${m[1]}-${m[2]}`,
                m[3],
            ]),
        );
        expect(Object.keys(tokens)).toHaveLength(expectedTokenCount);
        for (const [name, value] of listPaletteColors("ecc")) {
            expect(tokens[name]).toBe(value);
        }
    });

    it("matches the legacy aliases (incl. hex fallbacks) in src/css/legacy-vars.css", () => {
        const legacyCss = fs.readFileSync(path.join(__dirname, "../css/legacy-vars.css"), "utf8");
        const aliases = Object.fromEntries(
            [
                ...legacyCss.matchAll(
                    /--eccgui-color-palette-([a-z]+-[a-z]+)-(\d+):\s*var\(--color-ecc-([a-z]+)-(\d+),\s*(#[0-9a-fA-F]+)\);/g,
                ),
            ].map((m) => [
                `eccgui-color-palette-${m[1]}-${m[2]}`,
                { eccName: `color-ecc-${m[3]}-${m[4]}`, fallback: m[5] },
            ]),
        );
        expect(Object.keys(aliases)).toHaveLength(expectedTokenCount);

        const eccNames = listPaletteColors("ecc");
        listPaletteColors("legacy").forEach(([legacyName, value], index) => {
            const alias = aliases[legacyName];
            expect(alias).toBeDefined();
            // alias points at the corresponding ecc token and carries the identical hex fallback
            expect(alias.eccName).toBe(eccNames[index][0]);
            expect(alias.fallback).toBe(value);
        });
    });
});

/**
 * Token-contract test for `src/tailwind/theme.css`'s shadcn-style semantic tokens
 * (`:root` / `.dark` / `@theme inline`). Companion to the ecc ramp consistency suite
 * above — same "parse the CSS, compare against a source of truth" approach.
 */
describe("theme.css semantic token contract", () => {
    const themeCss = fs.readFileSync(path.join(__dirname, "../tailwind/theme.css"), "utf8");
    const rootVars = parseCssBlock(themeCss, ":root");
    const darkVars = parseCssBlock(themeCss, "\\.dark");
    // The only intentional light/dark asymmetry (verified in review): `.dark` inherits
    // `--radius` from `:root` (Tailwind custom properties cascade) instead of redeclaring it.
    const parityAllowlist = new Set(["--radius"]);

    describe("light/dark parity", () => {
        it("declares the same custom-property names in :root and .dark, aside from the allowlisted --radius", () => {
            const rootNames = Object.keys(rootVars);
            const darkNames = Object.keys(darkVars);

            const rootOnly = rootNames.filter((name) => !darkVars[name] && !parityAllowlist.has(name));
            const darkOnly = darkNames.filter((name) => !rootVars[name] && !parityAllowlist.has(name));

            expect(rootOnly).toEqual([]);
            expect(darkOnly).toEqual([]);
        });

        it("pins --radius as the sole allowlisted exception (present in :root, absent from .dark)", () => {
            expect(Object.keys(rootVars)).toContain("--radius");
            expect(rootVars["--radius"]).toBe("0.625rem");
            expect(darkVars).not.toHaveProperty("--radius");
        });

        it("has no other missing/extra custom properties hiding behind the allowlist", () => {
            // Guards against the allowlist silently growing to swallow a real future drift:
            // exactly one name may differ between the two blocks.
            const allNames = new Set([...Object.keys(rootVars), ...Object.keys(darkVars)]);
            const asymmetric = [...allNames].filter(
                (name) => Object.hasOwn(rootVars, name) !== Object.hasOwn(darkVars, name),
            );
            expect(asymmetric).toEqual(["--radius"]);
        });
    });

    describe("@theme inline color aliases", () => {
        // The first `@theme inline { ... }` block (radius scale + --color-* aliases). A second,
        // unrelated `@theme inline` block further down the file defines scroll-fade keyframes;
        // matching the first flat (non-nested) block only is intentional.
        const inlineVars = parseCssBlock(themeCss, "@theme inline");
        const colorAliases = Object.entries(inlineVars).filter(([name]) => name.startsWith("--color-"));

        it("defines at least the semantic color aliases used by the shadcn token contract", () => {
            // Sanity floor so this suite fails loudly if the block is ever mis-parsed as empty.
            expect(colorAliases.length).toBeGreaterThanOrEqual(20);
        });

        it.each(colorAliases)("--color-* alias %s resolves to a --var(...) backed by :root", (name, value) => {
            const match = value.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
            expect(match).not.toBeNull();
            const referenced = match?.[1] as string;
            expect(rootVars).toHaveProperty(referenced);
            // and, by the parity test above, the same name also exists in .dark
            expect(darkVars).toHaveProperty(referenced);
        });
    });

    describe("documented brand/intent derivations", () => {
        // eccenca palette hex sources cited in the theme.css doc comments.
        const blue900 = eccColorPalette.blue.values[900]; // #0a6199 — identity.accent
        const blue700 = eccColorPalette.blue.values[700]; // #4186b2 — lighter accent for dark bg
        const success900 = eccColorPalette.success.values[900];
        const success700 = eccColorPalette.success.values[700];
        const warning900 = eccColorPalette.warning.values[900];
        const warning700 = eccColorPalette.warning.values[700];
        const info900 = eccColorPalette.info.values[900];
        const info700 = eccColorPalette.info.values[700];

        const expectOklchCloseTo = (actual: string, hexSource: string) => {
            const { l, c, h } = parseOklch(actual);
            const expected = hexToOklch(hexSource);
            expect(l).toBeCloseTo(expected.l, 3);
            expect(c).toBeCloseTo(expected.c, 3);
            expect(h).toBeCloseTo(expected.h, 1);
        };

        it.each([
            ["--primary", "light", rootVars, blue900],
            ["--ring", "light", rootVars, blue900],
            ["--sidebar-primary", "light", rootVars, blue900],
            ["--primary", "dark", darkVars, blue700],
            ["--ring", "dark", darkVars, blue700],
            ["--sidebar-primary", "dark", darkVars, blue700],
        ] as const)(
            "%s (%s) is the eccenca accent blue, converted to OKLCH from the documented hex",
            (varName, _mode, vars, hexSource) => {
                expectOklchCloseTo(vars[varName], hexSource);
            },
        );

        it.each([
            ["--success", "light", rootVars, success900],
            ["--success", "dark", darkVars, success700],
            ["--warning", "light", rootVars, warning900],
            ["--warning", "dark", darkVars, warning700],
            ["--info", "light", rootVars, info900],
            ["--info", "dark", darkVars, info700],
        ] as const)(
            "%s (%s) is the eccenca semantic palette tint documented in its comment, converted to OKLCH",
            (varName, _mode, vars, hexSource) => {
                expectOklchCloseTo(vars[varName], hexSource);
            },
        );

        // --brand is documented as "derived from" the identity orange 900 tint (#f29100), but —
        // verified numerically — is NOT an exact OKLCH conversion of that hex (it converts to
        // oklch(0.742 0.167 64.6), not the oklch(0.727 0.163 63) below): it has been hand-tuned
        // for chrome legibility. That's a legitimate design choice, not a bug, so this pins the
        // literal authored values (locking against accidental drift) rather than asserting a
        // hex-derivation that was never actually exact.
        it("pins the literal --brand values (hand-tuned off the orange-900 tint, not an exact OKLCH conversion)", () => {
            expect(rootVars["--brand"]).toBe("oklch(0.727 0.163 63)");
            expect(darkVars["--brand"]).toBe("oklch(0.75 0.155 66)");
        });
    });
});
