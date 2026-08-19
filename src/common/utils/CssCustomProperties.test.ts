import CssCustomProperties from "./CssCustomProperties";

describe("CssCustomProperties in jsdom", () => {
    beforeEach(() => {
        const style = document.createElement("style");
        style.textContent = `
            :root { --eccgui-color-palette-blue-500: #1c6ecb; }
            .config { --note-yellow: #ffde8f; }
        `;
        document.head.appendChild(style);
    });

    it("reads property names of a style rule without iterating the declaration", () => {
        expect(
            CssCustomProperties.listLocalCssStyleRuleProperties({
                selectorText: ":root",
                propertyType: "custom",
            }),
        ).toEqual([["--eccgui-color-palette-blue-500", "#1c6ecb"]]);
    });

    it("does not throw for scoped selectors", () => {
        expect(() =>
            new CssCustomProperties({ selectorText: ".config", returnObject: false }).customProperties(),
        ).not.toThrow();
    });
});
