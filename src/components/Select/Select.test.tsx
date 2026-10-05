import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";

import FieldItem from "../Form/FieldItem";
import MenuItem from "../Menu/MenuItem";

import Select from "./Select";

it("connects a filterable Select search input to its listbox", async () => {
    const user = userEvent.setup();
    render(
        <Select
            items={["en"]}
            itemRenderer={(item, { handleClick, id }) => (
                <MenuItem
                    key={item}
                    text={item}
                    id={id}
                    role="option"
                    roleStructure="none"
                    tabIndex={-1}
                    onClick={handleClick}
                />
            )}
            onItemSelect={jest.fn()}
        >
            <button type="button">Choose language</button>
        </Select>,
    );

    await user.click(screen.getByRole("button", { name: "Choose language" }));
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
});

describe("non-filterable Select keyboard navigation", () => {
    it("keeps focus on the combobox while navigating and returns to it after Escape", async () => {
        const user = userEvent.setup();
        const onItemSelect = jest.fn();

        render(
            <>
                <button type="button">Before</button>
                <FieldItem labelProps={{ text: "Type" }}>
                    <Select
                        filterable={false}
                        items={["Value", "Object"]}
                        itemRenderer={(item, { handleClick, handleFocus, id, modifiers }) => (
                            <MenuItem
                                key={item}
                                text={item}
                                id={id}
                                onClick={handleClick}
                                onFocus={handleFocus}
                                active={modifiers.active}
                                aria-selected={modifiers.active}
                                role="option"
                                roleStructure="none"
                                tabIndex={-1}
                            />
                        )}
                        onItemSelect={onItemSelect}
                        text="Value"
                        contextOverlayProps={{ transitionDuration: 0 }}
                    />
                </FieldItem>
                <button type="button">After</button>
            </>,
        );

        await user.tab();
        await user.tab();
        const combobox = screen.getByRole("combobox");
        expect(combobox).toHaveFocus();
        expect(combobox).toHaveAccessibleName("Type");
        expect(screen.queryByRole("button", { name: "Type" })).not.toBeInTheDocument();

        await user.keyboard("{Enter}");
        expect(combobox).toHaveAttribute("aria-expanded", "true");
        expect(combobox).toHaveFocus();
        expect(document.getElementById(combobox.getAttribute("aria-activedescendant")!)).toEqual(
            screen.getByRole("option", { name: "Value" }),
        );

        await user.keyboard("{ArrowDown}");
        expect(combobox).toHaveFocus();
        expect(combobox).toHaveAttribute("aria-activedescendant", expect.any(String));
        expect(document.getElementById(combobox.getAttribute("aria-activedescendant")!)).toEqual(
            screen.getByRole("option", { name: "Object" }),
        );

        await user.keyboard("{Escape}");
        expect(combobox).toHaveFocus();
        expect(onItemSelect).not.toHaveBeenCalled();
        await user.tab();
        await waitFor(() => expect(screen.getByRole("button", { name: "After" })).toHaveFocus());
        await waitFor(() => expect(combobox).toHaveAttribute("aria-expanded", "false"));
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        expect(combobox).not.toHaveAttribute("aria-activedescendant");
    });

    it("selects the active option with Enter and keeps a custom button out of the Tab order", async () => {
        const user = userEvent.setup();
        const onItemSelect = jest.fn();
        render(
            <>
                <Select
                    filterable={false}
                    items={["Value", "Object"]}
                    itemRenderer={(item, { handleClick, id, modifiers }) => (
                        <MenuItem
                            key={item}
                            text={item}
                            id={id}
                            onClick={handleClick}
                            active={modifiers.active}
                            aria-selected={modifiers.active}
                            role="option"
                            roleStructure="none"
                            tabIndex={-1}
                        />
                    )}
                    onItemSelect={onItemSelect}
                    contextOverlayProps={{ transitionDuration: 0 }}
                >
                    <button type="button">Value</button>
                </Select>
                <button type="button">After</button>
            </>,
        );

        const combobox = screen.getByRole("combobox");
        await user.tab();
        expect(combobox).toHaveFocus();
        await user.keyboard("{Enter}{ArrowDown}{Enter}");
        expect(onItemSelect).toHaveBeenCalledWith("Object", expect.anything());
        await waitFor(() => expect(combobox).toHaveAttribute("aria-expanded", "false"));
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        expect(combobox).toHaveFocus();
        await user.tab();
        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });

    it("closes the list when Tab moves focus to the next control", async () => {
        const user = userEvent.setup();
        render(
            <>
                <Select
                    filterable={false}
                    items={["Value", "Object"]}
                    itemRenderer={(item, { handleClick, id, modifiers }) => (
                        <MenuItem
                            key={item}
                            text={item}
                            id={id}
                            onClick={handleClick}
                            active={modifiers.active}
                            aria-selected={modifiers.active}
                            role="option"
                            roleStructure="none"
                            tabIndex={-1}
                        />
                    )}
                    onItemSelect={jest.fn()}
                    text="Value"
                    contextOverlayProps={{ transitionDuration: 0 }}
                />
                <button type="button">After</button>
            </>,
        );

        const combobox = screen.getByRole("combobox");
        await user.tab();
        await user.keyboard("{Enter}");
        expect(combobox).toHaveAttribute("aria-expanded", "true");
        await user.tab();
        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
        await waitFor(() => expect(combobox).toHaveAttribute("aria-expanded", "false"));
    });
});
