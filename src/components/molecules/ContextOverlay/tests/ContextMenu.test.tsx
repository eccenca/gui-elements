import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";

import ContextMenu from "./../ContextMenu";
import { Default as ContextMenuStory } from "./../ContextMenu.stories";

describe("ContextMenu", () => {
    it("does not render the menu content before the toggler is activated", () => {
        render(<ContextMenu {...ContextMenuStory.args} />);
        expect(screen.queryByText("First option")).not.toBeInTheDocument();
    });

    it("renders a toggler button", () => {
        render(<ContextMenu {...ContextMenuStory.args} />);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("opens the menu and shows its items when the toggler is clicked", async () => {
        const user = userEvent.setup();
        render(<ContextMenu {...ContextMenuStory.args} />);

        await user.click(screen.getByRole("button"));

        expect(await screen.findByText("First option")).toBeVisible();
    });

    it("still opens when `preventPlaceholder` is set (accepted no-op prop)", async () => {
        const user = userEvent.setup();
        render(<ContextMenu {...ContextMenuStory.args} preventPlaceholder={true} />);

        await user.click(screen.getByRole("button"));

        expect(await screen.findByText("First option")).toBeVisible();
    });

    it("does not open the menu when disabled", async () => {
        const user = userEvent.setup();
        render(<ContextMenu {...ContextMenuStory.args} disabled={true} />);

        await user.click(screen.getByRole("button"));

        expect(screen.queryByText("First option")).not.toBeInTheDocument();
    });
});
