import React from "react";
import { Classes as BlueprintClasses } from "@blueprintjs/core";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { MenuItem } from "../../../index";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

describe("MenuItem", () => {
    it("should not apply an intent class when intent is undefined", () => {
        const { container } = render(<MenuItem text="item" intent={undefined} />);
        const menuItem = container.querySelector(`.${eccgui}-menu__item`);
        expect(menuItem).not.toBeNull();
        expect((menuItem as HTMLElement).className).not.toMatch(
            new RegExp(`${BlueprintClasses.getClassNamespace()}-intent-`),
        );
    });
    it("should apply the intent class for the custom accent intent", () => {
        const { container } = render(<MenuItem text="item" intent="accent" />);
        const menuItem = container.querySelector(`.${eccgui}-menu__item`);
        expect(menuItem).not.toBeNull();
        expect(menuItem).toHaveClass(`${BlueprintClasses.getClassNamespace()}-intent-accent`);
    });
});
