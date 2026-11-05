import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import MenuItem from "../../Menu/MenuItem";

import ContextMenu from "./../ContextMenu";
import { Default as ContextMenuStory } from "./../ContextMenu.stories";

const overlayWrapper = `${eccgui}-contextoverlay`;
const placeholderClass = `${overlayWrapper}__wrapper--placeholder`;

const checkForPlaceholderClass = (container: HTMLElement, tobe: number) => {
    expect(container.getElementsByClassName(placeholderClass).length).toBe(tobe);
};

describe("ContextMenu", () => {
    it("should render placeholder automatically", () => {
        const { container } = render(<ContextMenu {...ContextMenuStory.args} />);
        checkForPlaceholderClass(container, 1);
    });
    it("should not render placeholder when `preventPlaceholder===true`", () => {
        const { container } = render(<ContextMenu {...ContextMenuStory.args} preventPlaceholder={true} />);
        checkForPlaceholderClass(container, 0);
    });
    it("should render placeholder when `preventPlaceholder===false`", () => {
        const { container } = render(<ContextMenu {...ContextMenuStory.args} preventPlaceholder={false} />);
        checkForPlaceholderClass(container, 1);
    });
    it("if no placeholder is used the menu should be displayed on click", async () => {
        const { container } = render(<ContextMenu {...ContextMenuStory.args} preventPlaceholder={true} />);
        checkForPlaceholderClass(container, 0);
        fireEvent.click(container.getElementsByClassName(overlayWrapper)[0]);
        expect(await screen.findByText("First option")).toBeVisible();
    });
    it("if placeholder is used the menu should be displayed on click", async () => {
        const { container } = render(<ContextMenu {...ContextMenuStory.args} preventPlaceholder={false} />);
        checkForPlaceholderClass(container, 1);
        expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "menu");
        fireEvent.click(container.getElementsByClassName(overlayWrapper)[0]);
        expect(await screen.findByText("First option")).toBeVisible();
        expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "menu");
        expect(screen.getByRole("menu")).toBeVisible();
    });
    it("should use role `menu` for the menu by default", async () => {
        const { container } = render(<ContextMenu {...ContextMenuStory.args} preventPlaceholder={true} />);
        fireEvent.click(container.getElementsByClassName(overlayWrapper)[0]);
        expect(await screen.findByRole("menu")).toBeInTheDocument();
    });
    it("should forward `role` to the menu", async () => {
        const { container } = render(
            <ContextMenu role="listbox" preventPlaceholder={true}>
                <MenuItem text="First option" />
            </ContextMenu>,
        );
        fireEvent.click(container.getElementsByClassName(overlayWrapper)[0]);
        expect(await screen.findByRole("listbox")).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "First option" })).toBeInTheDocument();
    });
    it.each([true, false])(
        "should set `aria-haspopup` according to role `listbox` (preventPlaceholder: %s)",
        async (preventPlaceholder) => {
            const { container } = render(
                <ContextMenu role="listbox" preventPlaceholder={preventPlaceholder}>
                    <MenuItem text="First option" />
                </ContextMenu>,
            );
            expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "listbox");
            fireEvent.click(container.getElementsByClassName(overlayWrapper)[0]);
            expect(await screen.findByRole("listbox")).toBeVisible();
            expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "listbox");
        },
    );
});
