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

    describe("useComputedStyleFallback", () => {
        beforeEach(() => {
            // the property is not part of any stylesheet, so the CSSOM does not know its name
            const element = document.createElement("div");
            element.classList.add("without-stylesheet");
            element.style.setProperty("--only-computed", "#c0ffee");
            document.body.appendChild(element);
        });

        it("is disabled by default", () => {
            expect(
                new CssCustomProperties({
                    selectorText: ".without-stylesheet",
                }).customProperties(),
            ).toEqual({});
        });

        it("reads the names from the computed style if the CSSOM does not provide any", () => {
            expect(
                new CssCustomProperties({
                    selectorText: ".without-stylesheet",
                    useComputedStyleFallback: true,
                }).customProperties(),
            ).toEqual({ "only-computed": "#c0ffee" });
        });

        it("is not used if the CSSOM provides names", () => {
            expect(
                new CssCustomProperties({
                    selectorText: ".config",
                    useComputedStyleFallback: true,
                }).customProperties(),
            ).toEqual({ "note-yellow": "#ffde8f" });
        });
    });
});
