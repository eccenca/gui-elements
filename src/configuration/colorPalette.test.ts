import fs from "fs";
import path from "path";

import { COLOR_WEIGHTS, eccColorPalette, listPaletteColors } from "./colorPalette";

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

    it("matches the legacy aliases (incl. hex fallbacks) in src/css/index.css", () => {
        const legacyCss = fs.readFileSync(path.join(__dirname, "../css/index.css"), "utf8");
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
