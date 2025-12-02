import React from "react";
import { expect } from "@storybook/test";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { ApplicationViewability, ApplicationViewabilityProps, CLASSPREFIX as eccgui } from "../../../index";

import { Default as ApplicationViewabilityStory } from "./../stories/ApplicationViewability.stories";

const applyViewabilityAndCheckClass = (props: Omit<ApplicationViewabilityProps, "children">) => {
    const { container } = render(<ApplicationViewability {...ApplicationViewabilityStory.args} {...props} />);
    const element = container.getElementsByClassName(
        props.hide ? `${eccgui}-application__hide--${props.hide}` : `${eccgui}-application__show--${props.show}`
    );
    expect(element.length).toBe(1);
    return element;
};

describe("ApplicationViewability", () => {
    it("should be visible on `show=screen`", () => {
        applyViewabilityAndCheckClass({ show: "screen" });
        /**
         * Currently we cannot really test visibility via jest if it is defined by S/CSS rules because those styles are not known.
         * Looks like it is not too easy to include and test them.
         * So we only test for the correct CSS class.
         */
        // console.log(window.getComputedStyle(element.item(0)??new Element).getPropertyValue("display"));
        // waitFor(() => expect(element).toBeVisible());
    });
    it("should not be visible on `hide=screen`", () => {
        applyViewabilityAndCheckClass({ hide: "screen" });
        // waitFor(() => expect(element).not.toBeVisible());
    });
    it("should be visible on `hide=print`", () => {
        applyViewabilityAndCheckClass({ hide: "print" });
        // waitFor(() => expect(element).toBeVisible());
    });
    it("should not be visible on `show=print`", () => {
        applyViewabilityAndCheckClass({ show: "print" });
        // waitFor(() => expect(element).not.toBeVisible());
    });
});
