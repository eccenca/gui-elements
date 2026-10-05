import React from "react";
import { render, screen } from "@testing-library/react";
import path from "path";
import * as sass from "sass";

import "@testing-library/jest-dom";

import { ApplicationViewability, ApplicationViewabilityProps, CLASSPREFIX as eccgui } from "../../../index";

import { Default as ApplicationViewabilityStory } from "./../stories/ApplicationViewability.stories";

/**
 * The viewability behaviour is defined by S/CSS rules only, so the styles need to be
 * compiled and injected into the test document to be testable.
 * `jsdom` evaluates `@media screen` rules when computing styles, `@media print` rules are ignored.
 */
const compiledViewabilityStyles = sass.compile(path.resolve(__dirname, "./../_viewability.scss")).css;

let viewabilityStyleElement: HTMLStyleElement;

const renderViewability = (props: Omit<ApplicationViewabilityProps, "children">) => {
    const { container } = render(<ApplicationViewability {...ApplicationViewabilityStory.args} {...props} />);
    const elements = container.getElementsByClassName(
        props.hide ? `${eccgui}-application__hide--${props.hide}` : `${eccgui}-application__show--${props.show}`,
    );
    expect(elements.length).toBe(1);
    return elements[0] as HTMLElement;
};

describe("ApplicationViewability", () => {
    beforeAll(() => {
        viewabilityStyleElement = document.createElement("style");
        viewabilityStyleElement.textContent = compiledViewabilityStyles;
        document.head.appendChild(viewabilityStyleElement);
    });

    describe("sets the correct CSS class", () => {
        it("on `show=screen`", () => {
            renderViewability({ show: "screen" });
        });
        it("on `hide=screen`", () => {
            renderViewability({ hide: "screen" });
        });
        it("on `hide=print`", () => {
            renderViewability({ hide: "print" });
        });
        it("on `show=print`", () => {
            renderViewability({ show: "print" });
        });
    });

    describe("is visible on screen", () => {
        it("on `show=screen`", () => {
            expect(renderViewability({ show: "screen" })).toBeVisible();
        });
        it("on `hide=print`", () => {
            expect(renderViewability({ hide: "print" })).toBeVisible();
        });
    });

    /**
     * Elements hidden on screen must not be removed from the rendering, otherwise they
     * would be removed from the accessibility tree, too.
     */
    describe("is hidden on screen but still accessible", () => {
        it.each([{ hide: "screen" }, { show: "print" }] as Omit<ApplicationViewabilityProps, "children">[])(
            "on `%s`",
            (props) => {
                const element = renderViewability(props);
                const styles = getComputedStyle(element);

                // moved out of the viewport instead of being removed from the rendering
                expect(styles.display).not.toBe("none");
                expect(styles.visibility).not.toBe("hidden");
                expect(styles.position).toBe("absolute");
                expect(styles.opacity).toBe("0");
                expect(element).not.toBeVisible();

                // still part of the accessibility tree, `getByRole` ignores inaccessible elements
                expect(screen.getByRole("link", { name: "Link title" })).toBeInTheDocument();
            },
        );
    });

    /**
     * Computed styles are cached per element by `jsdom`, so the focus needs to be set
     * on a freshly rendered element before the styles are read.
     */
    describe("is displayed on screen if it contains a focused element", () => {
        it.each([{ hide: "screen" }, { show: "print" }] as Omit<ApplicationViewabilityProps, "children">[])(
            "on `%s`",
            (props) => {
                const element = renderViewability(props);
                expect(element.matches(":not(:has(:focus))")).toBe(true);

                element.querySelector("a")!.focus();

                expect(element.matches(":not(:has(:focus))")).toBe(false);
                expect(getComputedStyle(element).position).not.toBe("absolute");
                expect(element).toBeVisible();
            },
        );
    });

    /**
     * `@media print` rules are not applied by `jsdom`, so only the rule itself can be checked.
     */
    describe("is removed from the rendering on print", () => {
        it("on `hide=print` and `show=screen`", () => {
            const printRules = Array.from(viewabilityStyleElement.sheet!.cssRules)
                .filter((rule): rule is CSSMediaRule => (rule as CSSMediaRule).conditionText === "print")
                .flatMap((rule) => Array.from(rule.cssRules) as CSSStyleRule[]);

            expect(printRules.length).toBe(1);
            expect(printRules[0].selectorText.replace(/\s+/g, " ")).toBe(
                `.${eccgui}-application__hide--print, .${eccgui}-application__show--screen`,
            );
            expect(printRules[0].style.display).toBe("none");
        });
    });
});
