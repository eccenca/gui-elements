import React from "react";
import { render } from "@testing-library/react";

import { Depiction, DepictionProps } from "./Depiction";

const renderWithInlineSvg = (resizing?: DepictionProps["resizing"]) =>
    render(
        <Depiction
            resizing={resizing}
            image={
                <svg viewBox="0 0 20 10" data-testid="depiction-svg">
                    <rect width="20" height="10" />
                </svg>
            }
        />,
    );

describe("Depiction", () => {
    describe("preserveAspectRatio of inline SVG images", () => {
        it.each([
            ["contain", "xMidYMid meet"],
            ["cover", "xMidYMid slice"],
            ["stretch", "none"],
        ] as const)('resizing="%s" sets preserveAspectRatio="%s"', (resizing, expected) => {
            const { getByTestId } = renderWithInlineSvg(resizing);
            expect(getByTestId("depiction-svg").getAttribute("preserveAspectRatio")).toBe(expected);
        });

        it("never sets an empty preserveAspectRatio attribute", () => {
            (["contain", "cover", "stretch"] as const).forEach((resizing) => {
                const { getByTestId, unmount } = renderWithInlineSvg(resizing);
                expect(getByTestId("depiction-svg").getAttribute("preserveAspectRatio")).not.toBe("");
                unmount();
            });
        });
    });
});
