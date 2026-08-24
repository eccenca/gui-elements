import React from "react";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { ProgressBar } from "../../../index";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

describe("ProgressBar", () => {
    it("should not apply an intent class when no intent is set", () => {
        const { container } = render(<ProgressBar />);
        const progressbar = container.querySelector(`.${eccgui}-progressbar`);
        expect(progressbar).not.toBeNull();
        expect((progressbar as HTMLElement).className).not.toMatch(new RegExp(`${eccgui}-progressbar-intent-`));
    });
    it("should apply the matching intent class for a blueprint intent", () => {
        const { container } = render(<ProgressBar intent="success" />);
        const progressbar = container.querySelector(`.${eccgui}-progressbar`);
        expect(progressbar).not.toBeNull();
        expect(progressbar).toHaveClass(`${eccgui}-progressbar-intent-success`);
    });
    it("should apply the intent class for the custom accent intent", () => {
        const { container } = render(<ProgressBar intent="accent" />);
        const progressbar = container.querySelector(`.${eccgui}-progressbar`);
        expect(progressbar).not.toBeNull();
        expect(progressbar).toHaveClass(`${eccgui}-progressbar-intent-accent`);
    });
});
