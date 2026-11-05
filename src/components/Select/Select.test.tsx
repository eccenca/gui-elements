import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
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
    const renderClearableSelect = (onClearanceText = "Reset selection", disabled = false, filterable = false) => {
        const onClear = jest.fn();
        const onItemSelect = jest.fn();
        const ClearableSelect = () => {
            const [text, setText] = React.useState<string | undefined>("Value");
            return (
                <>
                    <button type="button">Before</button>
                    <FieldItem labelProps={{ text: "Type" }}>
                        <Select
                            filterable={filterable}
                            disabled={disabled}
                            items={["Value", "Object"]}
                            itemRenderer={(item, { handleClick, id, modifiers }) => (
                                <MenuItem
                                    key={item}
                                    id={id}
                                    text={item}
                                    onClick={handleClick}
                                    active={modifiers.active}
                                    roleStructure="none"
                                    role="option"
                                    tabIndex={-1}
                                />
                            )}
                            onItemSelect={onItemSelect}
                            onClearanceText={onClearanceText}
                            onClearanceHandler={() => {
                                onClear();
                                setText(undefined);
                            }}
                            text={text}
                            placeholder="Choose a type"
                            contextOverlayProps={{ transitionDuration: 0 }}
                        />
                    </FieldItem>
                    <button type="button">After</button>
                </>
            );
        };
        render(<ClearableSelect />);
        const control = screen.getByRole(filterable ? "button" : "combobox", { name: "Type" });
        const getClearAction = () => control.querySelector('[tabindex="0"]');
        return { control, getClearAction, onClear, onItemSelect };
    };

    it.each(["Reset selection", ""])("tabs through the clear action with tooltip %j", async (tooltip) => {
        const user = userEvent.setup();
        const { control: combobox, getClearAction, onClear } = renderClearableSelect(tooltip);

        await user.tab();
        expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();
        await user.tab();
        expect(combobox).toHaveFocus();
        await user.tab();
        expect(getClearAction()).toHaveFocus();
        await user.tab();
        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
        await user.tab({ shift: true });
        expect(getClearAction()).toHaveFocus();
        await user.tab({ shift: true });
        expect(combobox).toHaveFocus();
        await user.tab({ shift: true });
        expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();
        expect(combobox).toHaveAttribute("aria-expanded", "false");
        expect(onClear).not.toHaveBeenCalled();
    });

    it.each(["{Enter}", " "])("clears with %s without opening the list", async (key) => {
        const user = userEvent.setup();
        const { control: combobox, getClearAction, onClear, onItemSelect } = renderClearableSelect();
        await user.tab();
        await user.tab();
        await user.tab();
        expect(getClearAction()).toHaveFocus();
        await user.keyboard("{ArrowDown}");
        expect(combobox).toHaveAttribute("aria-expanded", "false");
        expect(getClearAction()).toHaveFocus();

        await user.keyboard(key);

        expect(onClear).toHaveBeenCalledTimes(1);
        expect(onItemSelect).not.toHaveBeenCalled();
        expect(combobox).toHaveTextContent("Choose a type");
        expect(combobox).toHaveAttribute("aria-expanded", "false");
        expect(combobox).toHaveFocus();
        await user.tab();
        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });

    it.each(["Reset selection", ""])("closes the open list when tabbing to clear with tooltip %j", async (tooltip) => {
        const user = userEvent.setup();
        const { control: combobox, getClearAction } = renderClearableSelect(tooltip);
        await user.tab();
        await user.tab();
        await user.keyboard("{Enter}");
        expect(combobox).toHaveAttribute("aria-expanded", "true");

        await user.tab();

        await waitFor(() => expect(combobox).toHaveAttribute("aria-expanded", "false"));
        await waitFor(() => expect(getClearAction()).toHaveFocus());
        await user.tab();
        await waitFor(() => expect(screen.getByRole("button", { name: "After" })).toHaveFocus());
    });

    it("keeps focus on the next control after the clear tooltip updates", async () => {
        const user = userEvent.setup();
        renderClearableSelect();
        await user.tab();
        await user.tab();
        await user.tab();
        await user.tab();

        await act(async () => new Promise<void>((resolve) => setTimeout(resolve, 200)));

        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });

    it("skips both the combobox and clear action when disabled", async () => {
        const user = userEvent.setup();
        const { onClear } = renderClearableSelect("Reset selection", true);
        await user.tab();
        await user.tab();

        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
        expect(onClear).not.toHaveBeenCalled();
    });

    it.each(["{Enter}", " "])("clears a filterable Select with %s without opening the list", async (key) => {
        const user = userEvent.setup();
        const { control, getClearAction, onClear, onItemSelect } = renderClearableSelect(
            "Reset selection",
            false,
            true,
        );
        await user.tab();
        await user.tab();
        expect(control).toHaveFocus();
        await user.tab();
        expect(getClearAction()).toHaveFocus();

        await user.keyboard(key);

        expect(onClear).toHaveBeenCalledTimes(1);
        expect(onItemSelect).not.toHaveBeenCalled();
        expect(control).toHaveFocus();
        expect(control).toHaveTextContent("Choose a type");
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("preserves pointer clearing without opening the list", async () => {
        const user = userEvent.setup();
        const { control, getClearAction, onClear } = renderClearableSelect();

        await user.click(getClearAction()!);

        expect(onClear).toHaveBeenCalledTimes(1);
        expect(control).toHaveFocus();
        expect(control).toHaveAttribute("aria-expanded", "false");
        expect(control).toHaveTextContent("Choose a type");
    });

    it.each([false, true])("handles label clicks with disabled=%s", async (disabled) => {
        const user = userEvent.setup();
        render(
            <FieldItem labelProps={{ text: "Type" }}>
                <Select
                    filterable={false}
                    disabled={disabled}
                    items={["Value"]}
                    itemRenderer={(item, { handleClick, id }) => (
                        <MenuItem key={item} id={id} text={item} onClick={handleClick} />
                    )}
                    onItemSelect={jest.fn()}
                    text="Value"
                />
            </FieldItem>,
        );
        const combobox = screen.getByRole("combobox", { name: "Type" });
        const focusControl = jest.spyOn(combobox, "focus");

        await user.click(screen.getByText("Type"));

        if (disabled) {
            expect(focusControl).not.toHaveBeenCalled();
            expect(combobox).not.toHaveFocus();
        } else {
            expect(combobox).toHaveFocus();
        }
        expect(combobox).toHaveAttribute("aria-expanded", "false");
    });

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
