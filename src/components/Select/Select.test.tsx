import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

    it.each(["Reset selection", ""])("tabs through the clear action with onClearanceText %j", async (clearanceText) => {
        const user = userEvent.setup();
        const { control: combobox, getClearAction, onClear } = renderClearableSelect(clearanceText);

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

    it.each(["Reset selection", ""])(
        "closes the open list when tabbing to clear with onClearanceText %j",
        async (clearanceText) => {
            const user = userEvent.setup();
            const { control: combobox, getClearAction } = renderClearableSelect(clearanceText);
            await user.tab();
            await user.tab();
            await user.keyboard("{Enter}");
            expect(combobox).toHaveAttribute("aria-expanded", "true");

            await user.tab();

            await waitFor(() => expect(combobox).toHaveAttribute("aria-expanded", "false"));
            await waitFor(() => expect(getClearAction()).toHaveFocus());
            await user.tab();
            await waitFor(() => expect(screen.getByRole("button", { name: "After" })).toHaveFocus());
        },
    );

    it("keeps focus on the next control after tabbing past the clear action", async () => {
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

    it("prevents scrolling the page when Space opens or is pressed in the list", async () => {
        render(
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
                        role="option"
                        roleStructure="none"
                        tabIndex={-1}
                    />
                )}
                onItemSelect={jest.fn()}
                text="Value"
                contextOverlayProps={{ transitionDuration: 0 }}
            />,
        );
        const combobox = screen.getByRole("combobox");
        combobox.focus();

        // `fireEvent` returns `false` if the default action was prevented
        expect(fireEvent.keyDown(combobox, { key: " ", code: "Space" })).toBe(false);
        expect(combobox).toHaveAttribute("aria-expanded", "true");
        expect(fireEvent.keyDown(combobox, { key: " ", code: "Space" })).toBe(false);
        // other keys keep their default action, e.g. Tab
        expect(fireEvent.keyDown(combobox, { key: "Tab", code: "Tab" })).toBe(true);
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

describe("non-filterable Select target", () => {
    const CustomTarget = ({ label }: { label: string }) => <button type="button">{label}</button>;

    const renderSelect = (filterable: boolean, children?: React.ReactNode, text: string | undefined = "Value") => (
        <Select
            filterable={filterable}
            items={["Value"]}
            itemRenderer={(item, { handleClick, id }) => (
                <MenuItem key={item} id={id} text={item} onClick={handleClick} />
            )}
            onItemSelect={jest.fn()}
            onClearanceHandler={jest.fn()}
            text={text}
            placeholder="Choose a type"
        >
            {children}
        </Select>
    );

    it.each([false, true])(
        "renders the default target without a select button (inside FieldItem: %s)",
        (inFieldItem) => {
            const select = renderSelect(false);
            render(inFieldItem ? <FieldItem labelProps={{ text: "Type" }}>{select}</FieldItem> : select);

            const combobox = screen.getByRole("combobox");
            // the clear action is the only button inside the combobox
            expect(screen.getByRole("button")).toHaveAccessibleName("Reset selection");
            expect(combobox).toContainElement(screen.getByRole("button"));
            expect(combobox).toHaveTextContent("Value");
            // only decorative icons are hidden, the selected value and the clear action stay exposed
            expect(combobox.querySelector('[aria-hidden="true"]:not(svg)')).not.toBeInTheDocument();
            if (inFieldItem) {
                expect(combobox).toHaveAccessibleName("Type");
            }
        },
    );

    it("exposes the placeholder of the default target", () => {
        render(renderSelect(false, undefined, ""));
        expect(screen.getByRole("combobox")).toHaveTextContent("Choose a type");
    });

    it.each([
        ["button", <button type="button">Value</button>],
        [
            "fragment",
            <>
                <button type="button">Value</button>
            </>,
        ],
        [
            "array",
            [
                <button key="button" type="button">
                    Value
                </button>,
                <span key="text">Text</span>,
            ],
        ],
        [
            "div containing a button",
            <div>
                <button type="button">Value</button>
            </div>,
        ],
        ["component without prop forwarding", <CustomTarget label="Value" />],
    ])("keeps a custom %s target out of the Tab order", async (_, children) => {
        const user = userEvent.setup();
        const { container } = render(
            <>
                {renderSelect(false, children)}
                <button type="button">After</button>
            </>,
        );
        const targetButton = container.querySelector(".eccgui-select button");

        expect(targetButton).toHaveAttribute("tabindex", "-1");
        expect(targetButton).toHaveAttribute("aria-hidden", "true");
        await user.tab();
        expect(screen.getByRole("combobox")).toHaveFocus();
        await user.tab();
        expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });

    it("restores a custom target when the Select becomes filterable", () => {
        const children = (
            <button type="button" tabIndex={0} aria-hidden={false}>
                Value
            </button>
        );
        const { container, rerender } = render(
            <FieldItem labelProps={{ text: "Type" }}>{renderSelect(false, children)}</FieldItem>,
        );
        const getTargetButton = () => container.querySelector(".eccgui-select button");
        expect(getTargetButton()).toHaveAttribute("tabindex", "-1");
        expect(getTargetButton()).toHaveAttribute("aria-hidden", "true");

        rerender(<FieldItem labelProps={{ text: "Type" }}>{renderSelect(true, children)}</FieldItem>);
        expect(getTargetButton()).toHaveAttribute("tabindex", "0");
        expect(getTargetButton()).toHaveAttribute("aria-hidden", "false");
        expect(screen.getByRole("button", { name: "Type" })).toBe(getTargetButton());

        rerender(<FieldItem labelProps={{ text: "Type" }}>{renderSelect(false, children)}</FieldItem>);
        expect(getTargetButton()).toHaveAttribute("tabindex", "-1");
        expect(getTargetButton()).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("combobox", { name: "Type" })).toBeInTheDocument();
    });

    it("switches the default target between button and combobox content", () => {
        const { rerender } = render(<FieldItem labelProps={{ text: "Type" }}>{renderSelect(false)}</FieldItem>);
        // the clear action is the only button
        expect(screen.getByRole("button")).toHaveAccessibleName("Reset selection");

        rerender(<FieldItem labelProps={{ text: "Type" }}>{renderSelect(true)}</FieldItem>);
        expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Type" })).toHaveTextContent("Value");

        rerender(<FieldItem labelProps={{ text: "Type" }}>{renderSelect(false)}</FieldItem>);
        expect(screen.getByRole("button")).toHaveAccessibleName("Reset selection");
        expect(screen.getByRole("combobox", { name: "Type" })).toHaveTextContent("Value");
    });
});
