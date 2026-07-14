import { BADGE_INVALID_CLS, BADGE_VALID_CLS, fromDiv, isBaseStripped, toHtml } from "../tokenHtml";

// Mirrors the round-trip the component performs: render `value` via toHtml,
// read it back via fromDiv, then apply the same prepend rule handleInput uses
// (gated on whether toHtml actually stripped the base — isBaseStripped).
function roundTrip(value: string, fields: string[], baseChip?: string, staticBase?: boolean): string {
    const el = document.createElement("div");
    el.innerHTML = toHtml(value, fields, baseChip, staticBase);
    const body = fromDiv(el);
    const stripped = isBaseStripped(value, baseChip, staticBase);
    return stripped && baseChip ? baseChip + body : body;
}

const BASE = "https://example.org/ontology/";

describe("TokenInput round-trip (staticBase)", () => {
    it("round-trips a value that starts with the base", () => {
        const v = `${BASE}order/{orderId}`;
        expect(isBaseStripped(v, BASE, true)).toBe(true);
        expect(roundTrip(v, ["orderId"], BASE, true)).toBe(v);
    });

    it("round-trips a value that does NOT start with the base (no corruption)", () => {
        const v = "https://example.org/order/{orderId}";
        expect(isBaseStripped(v, BASE, true)).toBe(false);
        expect(roundTrip(v, ["orderId"], BASE, true)).toBe(v);
    });

    it("round-trips an empty value", () => {
        expect(isBaseStripped("", BASE, true)).toBe(false);
        expect(roundTrip("", ["orderId"], BASE, true)).toBe("");
    });

    it("round-trips a plain value with no base configured", () => {
        const v = "{orderId}/suffix";
        expect(roundTrip(v, ["orderId"])).toBe(v);
    });

    it("round-trips a non-staticBase value containing the base inline", () => {
        const v = `${BASE}{orderId}`;
        // non-staticBase: base is an inline data-base chip, never prepended
        expect(isBaseStripped(v, BASE, false)).toBe(false);
        expect(roundTrip(v, ["orderId"], BASE, false)).toBe(v);
    });

    it("escapes double-quotes in an inline base chip so it cannot break out of the attribute", () => {
        const malicious = `https://x/" onmouseover="alert(1)" x="`;
        const v = `${malicious}{orderId}`;
        const el = document.createElement("div");
        el.innerHTML = toHtml(v, ["orderId"], malicious, false);
        const chip = el.querySelector("[data-base]") as HTMLElement;
        // The entire base stays inside the attribute — no breakout, no injected handler.
        expect(chip.getAttribute("data-base")).toBe(malicious);
        expect(chip.getAttribute("onmouseover")).toBeNull();
        // And the value still round-trips losslessly.
        expect(roundTrip(v, ["orderId"], malicious, false)).toBe(v);
    });
});

describe("TokenInput dotted field tokens", () => {
    it("renders a dotted field path as a chip and round-trips it", () => {
        const v = "concatenate {isbn} , '/description/' , {descriptions.lang}";
        const el = document.createElement("div");
        el.innerHTML = toHtml(v, ["isbn", "lang"]);
        const fields = [...el.querySelectorAll<HTMLElement>("[data-field]")].map((s) => s.getAttribute("data-field"));
        expect(fields).toEqual(["isbn", "descriptions.lang"]);
        expect(roundTrip(v, ["isbn", "lang"])).toBe(v);
    });

    it("colours a dotted field valid when its last segment is a known field", () => {
        const el = document.createElement("div");
        el.innerHTML = toHtml("{descriptions.lang}", ["lang"]);
        const chip = el.querySelector("[data-field]") as HTMLElement;
        expect(chip.className).toBe(BADGE_VALID_CLS);
    });

    it("colours an unknown dotted field invalid", () => {
        const el = document.createElement("div");
        el.innerHTML = toHtml("{foo.bar}", ["lang"]);
        const chip = el.querySelector("[data-field]") as HTMLElement;
        expect(chip.className).toBe(BADGE_INVALID_CLS);
    });

    it("renders an array path chip with the short label but round-trips the full path", () => {
        const el = document.createElement("div");
        el.innerHTML = toHtml("{descriptions[].lang}", ["lang"]);
        const chip = el.querySelector("[data-field]") as HTMLElement;
        // Displays the short label (matching the palette) …
        expect(chip.textContent).toBe("lang");
        expect(chip.className).toBe(BADGE_VALID_CLS);
        // … but keeps the full path in data-field so serialization is lossless.
        expect(chip.getAttribute("data-field")).toBe("descriptions[].lang");
        expect(roundTrip("{descriptions[].lang}", ["lang"])).toBe("{descriptions[].lang}");
    });
});

describe("TokenInput inline base chip (non-leading)", () => {
    it("renders the base as a chip wherever it appears and round-trips", () => {
        const v = `concatenate ${BASE} , {isbn} , '/description/' , {descriptions.lang}`;
        const el = document.createElement("div");
        el.innerHTML = toHtml(v, ["isbn", "lang"], BASE, false);
        expect(el.querySelectorAll("[data-base]")).toHaveLength(1);
        expect(el.querySelectorAll("[data-field]")).toHaveLength(2);
        // A mid-string base is not "stripped" (that flag is leading-only), so no prepend.
        expect(isBaseStripped(v, BASE, false)).toBe(false);
        expect(roundTrip(v, ["isbn", "lang"], BASE, false)).toBe(v);
    });

    it("renders every occurrence of the base as a chip", () => {
        const v = `${BASE}a/${BASE}b`;
        const el = document.createElement("div");
        el.innerHTML = toHtml(v, [], BASE, false);
        expect(el.querySelectorAll("[data-base]")).toHaveLength(2);
        expect(roundTrip(v, [], BASE, false)).toBe(v);
    });

    it("staticBase strips the leading base but still chips a mid-string occurrence", () => {
        const v = `${BASE}order/{orderId}/see/${BASE}`;
        const el = document.createElement("div");
        el.innerHTML = toHtml(v, ["orderId"], BASE, true);
        // Leading base lives in the outside badge (not inline); the trailing one is a chip.
        expect(el.querySelectorAll("[data-base]")).toHaveLength(1);
        expect(roundTrip(v, ["orderId"], BASE, true)).toBe(v);
    });
});
