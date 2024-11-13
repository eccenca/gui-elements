import React, { useCallback, useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";

import { MultiSuggestField } from "../../../../index";
import { CustomSearch, Default, dropdownOnFocus, predefinedNotControlledValues } from "../MultiSuggestField.stories";

const testLabels = ["label1", "label2", "label3", "label4", "label5"];

const items = new Array(5).fill(undefined).map((_, id) => {
    const testLabel = testLabels[id];
    return { testLabel, testId: `${testLabel}-id` };
});

export const TestComponent = (): JSX.Element => {
    const copy: Array<{ testLabel: string; testId: string }> = [items[2]];

    const [selected, setSelected] = useState(copy);

    const handleOnSelect = useCallback((params) => {
        const items = params.selectedItems;
        setSelected(items);
    }, []);

    const handleReset = (): void => {
        setSelected(copy);
    };

    return (
        <div>
            <button data-testid="reset-button" onClick={handleReset}>
                Reset
            </button>
            <br />
            <br />
            <MultiSuggestField<{ testLabel: string; testId: string }>
                items={items}
                createNewItemFromQuery={(query) => ({ testId: `${query}-id`, testLabel: query })}
                onSelection={handleOnSelect}
                itemId={({ testId }) => testId}
                itemLabel={({ testLabel }) => testLabel}
                selectedItems={selected}
            />
        </div>
    );
};

describe("MultiSuggestField", () => {
    describe("uncontrolled (when only selectedItems or onSelect is provided)", () => {
        it("should render default input", () => {
            const { container } = render(<MultiSuggestField {...Default.args} />);
            const [input] = container.getElementsByClassName("eccgui-multiselect");

            expect(input).toBeInTheDocument();
        });

        it("should render default selected items", async () => {
            const { getByText } = render(<MultiSuggestField {...predefinedNotControlledValues.args} />);

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(getByText(firstSelected)).toBeInTheDocument();
                expect(getByText(secondSelected)).toBeInTheDocument();
            });
        });

        it("should clear all selected items on clear button click", async () => {
            const { container } = render(
                <MultiSuggestField
                    data-test-id="multi-suggest-field"
                    {...predefinedNotControlledValues.args}
                    onSelection={undefined}
                />
            );

            const selectedLength = predefinedNotControlledValues.args.selectedItems.length;

            expect(container.querySelectorAll("[data-tag-index]").length).toBe(selectedLength);

            const clearButton = container.querySelector('[data-test-id="multi-suggest-field_clearance"');

            expect(clearButton).toBeInTheDocument();

            fireEvent.click(clearButton!);

            await waitFor(() => {
                expect(container.querySelectorAll("[data-tag-index]").length).toBe(0);
            });
        });

        it("should filter options and reset them if the query is empty", async () => {
            const { container } = render(<MultiSuggestField {...dropdownOnFocus.args} />);

            const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
            const [input] = inputContainer.getElementsByTagName("input");

            fireEvent.click(input);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(dropdownOnFocus.args.items.length);
            });

            fireEvent.change(input, { target: { value: "ex" } });

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");

                expect(menuItems.length).toBe(1);

                const noResult = screen.queryByText(dropdownOnFocus.args.noResultText);
                expect(noResult).not.toBeInTheDocument();
            });

            fireEvent.change(input, { target: { value: "ttt" } });

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");

                expect(menuItems.length).toBe(1);

                const noResult = screen.queryByText(dropdownOnFocus.args.noResultText);
                expect(noResult).toBeInTheDocument();
            });

            fireEvent.change(input, { target: { value: "" } });

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(dropdownOnFocus.args.items.length);
            });
        });

        it("should render disable field with selected items", async () => {
            const { container, getByText } = render(
                <MultiSuggestField {...predefinedNotControlledValues.args} disabled />
            );

            const [inputTargetContainer] = container.getElementsByClassName("eccgui-multiselect__target");

            expect(inputTargetContainer.getAttribute("aria-disabled")).toBe("true");

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(getByText(firstSelected)).toBeInTheDocument();
                expect(getByText(secondSelected)).toBeInTheDocument();
            });
        });

        it("should set deferred selection correctly when only selected items provided and remove selection", async () => {
            const args = { ...predefinedNotControlledValues.args, selectedItems: [] };

            const { rerender, container } = render(<MultiSuggestField {...args} data-test-id="multi-suggest-field" />);

            const clearButtonBefore = container.querySelector("[data-test-id='multi-suggest-field_clearance'");

            expect(clearButtonBefore).not.toBeInTheDocument();

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(screen.queryByText(firstSelected)).toBeNull();
                expect(screen.queryByText(secondSelected)).toBeNull();
            });

            rerender(<MultiSuggestField {...predefinedNotControlledValues.args} data-test-id="multi-suggest-field" />);

            await waitFor(() => {
                expect(screen.getByText(firstSelected)).toBeInTheDocument();
                expect(screen.getByText(secondSelected)).toBeInTheDocument();
            });

            await waitFor(() => {
                const clearButtonAfter = container.querySelector("[data-test-id='multi-suggest-field_clearance'");

                expect(clearButtonAfter).toBeInTheDocument();

                fireEvent.click(clearButtonAfter!);
            });

            await waitFor(() => {
                expect(container.querySelectorAll("[data-tag-index]").length).toBe(0);
            });
        });

        it("should render disable field with deferred selected items", async () => {
            const { container, rerender } = render(
                <MultiSuggestField {...predefinedNotControlledValues.args} selectedItems={[]} disabled />
            );

            const [inputTargetContainer] = container.getElementsByClassName("eccgui-multiselect__target");

            expect(inputTargetContainer.getAttribute("aria-disabled")).toBe("true");

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(screen.queryByText(firstSelected)).toBeNull();
                expect(screen.queryByText(secondSelected)).toBeNull();
            });

            rerender(<MultiSuggestField {...predefinedNotControlledValues.args} disabled />);

            const [updatedInputTargetContainer] = container.getElementsByClassName("eccgui-multiselect__target");

            expect(updatedInputTargetContainer.getAttribute("aria-disabled")).toBe("true");

            await waitFor(() => {
                expect(screen.getByText(firstSelected)).toBeInTheDocument();
                expect(screen.getByText(secondSelected)).toBeInTheDocument();
            });
        });

        it("should call onSelection function with the selected items", async () => {
            const onSelection = jest.fn();

            const { container } = render(
                <MultiSuggestField {...dropdownOnFocus.args} items={items} onSelection={onSelection} />
            );

            const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
            const [input] = inputContainer.getElementsByTagName("input");

            fireEvent.click(input);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(dropdownOnFocus.args.items.length);

                const item = menuItems[0];
                fireEvent.click(item);
            });

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items[0],
                    selectedItems: [items[0]],
                };
                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });
        });

        it("should filter items by custom search function", async () => {
            const { container } = render(<MultiSuggestField {...CustomSearch.args} items={items} />);

            const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
            const [input] = inputContainer.getElementsByTagName("input");

            fireEvent.click(input);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(CustomSearch.args.items.length);
            });

            fireEvent.change(input, { target: { value: "label1" } });

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(1);

                const item = menuItems[0];

                const [div] = item.getElementsByTagName("div");
                expect(div.textContent).toBe("label1");
            });

            fireEvent.change(input, { target: { value: "label1-id" } });

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(1);

                const item = menuItems[0];

                const [div] = item.getElementsByTagName("div");
                expect(div.textContent).toBe("label1");
            });

            fireEvent.change(input, { target: { value: "label1-id-other" } });

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(1);

                const item = menuItems[0];

                const [div] = item.getElementsByTagName("div");
                expect(div.textContent).toBe("No results.");
            });
        });
    });

    describe("controlled (when both selectedItems and onSelect are provided)", () => {
        it("should render default selected items", async () => {
            const onSelection = jest.fn();

            const { getByText } = render(
                <MultiSuggestField {...predefinedNotControlledValues.args} onSelection={onSelection} />
            );

            const [firstSelected, secondSelected]: Array<string> = predefinedNotControlledValues.args.selectedItems.map(
                ({ testLabel }) => testLabel
            );

            await waitFor(() => {
                expect(getByText(firstSelected)).toBeInTheDocument();
                expect(getByText(secondSelected)).toBeInTheDocument();
            });
        });

        it("should call onSelection function with the selected items", async () => {
            const onSelection = jest.fn((values) => {
                // eslint-disable-next-line no-console
                console.log("Mocked onSelection function values: ", values);
            });

            const { container } = render(
                <MultiSuggestField
                    {...dropdownOnFocus.args}
                    items={items}
                    selectedItems={[]}
                    onSelection={onSelection}
                />
            );

            const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
            const [input] = inputContainer.getElementsByTagName("input");

            fireEvent.click(input);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(dropdownOnFocus.args.items.length);

                const item = menuItems[0];
                fireEvent.click(item);
            });

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items[0],
                    selectedItems: [items[0]],
                };

                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });
        });

        it("should set deferred selection correctly and reset values", async () => {
            const onSelection = jest.fn((values) => {
                // eslint-disable-next-line no-console
                console.log("Mocked onSelection function values: ", values);
            });

            const items = predefinedNotControlledValues.args.items;

            const args = { ...predefinedNotControlledValues.args, selectedItems: [], onSelection: onSelection };

            const { container, rerender } = render(<MultiSuggestField {...args} data-test-id="multi-suggest-field" />);

            const [inputContainer] = container.getElementsByClassName("eccgui-multiselect");
            const [input] = inputContainer.getElementsByTagName("input");

            const clearButtonBefore = container.querySelector("[data-test-id='multi-suggest-field_clearance'");

            expect(clearButtonBefore).not.toBeInTheDocument();

            fireEvent.click(input);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(predefinedNotControlledValues.args.items.length);

                const item = menuItems[0];
                fireEvent.click(item);
            });

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items[0],
                    selectedItems: [items[0]],
                };
                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });

            const selectedItems = items.slice(2);

            rerender(<MultiSuggestField {...args} selectedItems={selectedItems} data-test-id="multi-suggest-field" />);

            await waitFor(() => {
                const listbox = screen.getByRole("listbox");
                expect(listbox).toBeInTheDocument();

                const menuItems = listbox.getElementsByClassName("eccgui-menu__item");
                expect(menuItems.length).toBe(predefinedNotControlledValues.args.items.length);

                const item = menuItems[0];
                fireEvent.click(item);
            });

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items[0],
                    selectedItems: [...selectedItems, items[0]],
                };

                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });

            await waitFor(() => {
                const clearButtonAfter = container.querySelector("[data-test-id='multi-suggest-field_clearance'");

                expect(clearButtonAfter).toBeInTheDocument();

                fireEvent.click(clearButtonAfter!);
            });

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    selectedItems: [],
                };

                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });
        });

        it("should set prePopulateWithItems as selected values and override passed values", async () => {
            const onSelection = jest.fn((values) => {
                // eslint-disable-next-line no-console
                console.log("Mocked onSelection function values: ", values);
            });

            const items = dropdownOnFocus.args.items;

            const args = { ...dropdownOnFocus.args, onSelection: onSelection };

            const { container } = render(
                <MultiSuggestField {...args} data-test-id="multi-suggest-field" prePopulateWithItems />
            );

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items.at(-1),
                    selectedItems: items,
                };
                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });

            const tags = container.querySelectorAll("span[data-tag-index]");

            expect(tags.length).toBe(items.length);
        });

        it("should correctly deselect all tags from input", async () => {
            const onSelection = jest.fn((values) => {
                // eslint-disable-next-line no-console
                console.log("Mocked onSelection function values 111: ", values);
            });

            const items = predefinedNotControlledValues.args.items;

            const args = { ...predefinedNotControlledValues.args, selectedItems: undefined, onSelection: onSelection };

            const { container } = render(
                <MultiSuggestField {...args} data-test-id="multi-suggest-field" prePopulateWithItems />
            );

            await waitFor(() => {
                const expectedObject = {
                    createdItems: [],
                    newlySelected: items.at(-1),
                    selectedItems: items,
                };
                expect(onSelection).toHaveBeenCalledWith(expectedObject);
            });

            let tags = container.querySelectorAll("span[data-tag-index]");
            expect(tags.length).toBe(items.length);

            for (let i = 0; i < items.length; i += 1) {
                const tag = tags[0];
                expect(tag.querySelector("span")).toHaveTextContent(items[i].testLabel);

                const removeTagButton = tag.querySelector("button");
                expect(removeTagButton).toBeTruthy();

                fireEvent.click(removeTagButton!);

                await waitFor(() => {
                    const selected = items.slice(i + 1);

                    const expectedObject = {
                        createdItems: [],
                        newlySelected: selected.at(-1),
                        selectedItems: selected,
                    };

                    expect(onSelection).toHaveBeenCalledWith(expectedObject);
                });

                tags = container.querySelectorAll("span[data-tag-index]");
            }

            const tagsAfterRemove = container.querySelectorAll("span[data-tag-index]");
            expect(tagsAfterRemove.length).toBe(0);
        });

        it("should not contain the custom css property when limitHeightOpened not provided", async () => {
            const { container } = render(
                <MultiSuggestField {...Default.args} openOnKeyDown={false} data-testid="multi-suggest-field" />
            );

            const [inputTargetContainer] = container.getElementsByClassName("eccgui-multiselect");

            fireEvent.click(inputTargetContainer);

            await waitFor(() => {
                const dropdown = screen.getByTestId("multi-suggest-field_dropdown");
                const customProperty = (dropdown as HTMLElement)?.style?.getPropertyValue(
                    "--eccgui-multisuggestfield-max-height"
                );

                expect(customProperty).toBeFalsy();
            });
        });

        it("should notcontain the custom css property when limitHeightOpened greater than 100", async () => {
            const { container } = render(
                <MultiSuggestField
                    {...Default.args}
                    openOnKeyDown={false}
                    limitHeightOpened={110}
                    data-testid="multi-suggest-field"
                />
            );

            const [inputTargetContainer] = container.getElementsByClassName("eccgui-multiselect");

            fireEvent.click(inputTargetContainer);

            await waitFor(() => {
                const dropdown = screen.getByTestId("multi-suggest-field_dropdown");

                const customProperty = (dropdown as HTMLElement)?.style?.getPropertyValue(
                    "--eccgui-multisuggestfield-max-height"
                );

                expect(customProperty).toBeFalsy();
            });
        });

        it("should contain the custom css property when limitHeightOpened is true", async () => {
            const { container } = render(
                <MultiSuggestField
                    {...Default.args}
                    openOnKeyDown={false}
                    limitHeightOpened
                    data-testid="multi-suggest-field"
                />
            );

            const [inputTargetContainer] = container.getElementsByClassName("eccgui-multiselect");

            fireEvent.click(inputTargetContainer);

            await waitFor(() => {
                const dropdown = screen.getByTestId("multi-suggest-field_dropdown");

                const customProperty = (dropdown as HTMLElement)?.style?.getPropertyValue(
                    "--eccgui-multisuggestfield-max-height"
                );

                expect(customProperty).toBeDefined();
            });
        });

        it("should contain the custom css property when limitHeightOpened a valid number value", async () => {
            const { container } = render(
                <MultiSuggestField
                    {...Default.args}
                    openOnKeyDown={false}
                    limitHeightOpened={80}
                    data-testid="multi-suggest-field"
                />
            );

            const [inputTargetContainer] = container.getElementsByClassName("eccgui-multiselect");

            fireEvent.click(inputTargetContainer);

            await waitFor(() => {
                const dropdown = screen.getByTestId("multi-suggest-field_dropdown");

                const customProperty = (dropdown as HTMLElement)?.style?.getPropertyValue(
                    "--eccgui-multisuggestfield-max-height"
                );

                expect(customProperty).toBeDefined();
            });
        });
    });
});
