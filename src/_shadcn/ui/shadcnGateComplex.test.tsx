import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "./combobox";
import { Command, CommandList } from "./command";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./context-menu";
import { Toaster } from "./sonner";

describe("shadcn complex primitives (W1.2)", () => {
    afterEach(() => {
        document.documentElement.classList.remove("dark");
    });

    describe("ref forwarding", () => {
        it("forwards a ref to the Command root", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <Command ref={ref}>
                    <CommandList />
                </Command>,
            );
            expect(ref.current).toBeInstanceOf(HTMLElement);
            expect(ref.current).toHaveAttribute("data-slot", "command");
        });

        it("forwards a ref to a ContextMenuTrigger-wrapped element", () => {
            const ref = React.createRef<HTMLElement>();
            render(
                <ContextMenu>
                    <ContextMenuTrigger ref={ref}>Right-click me</ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem>Item</ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>,
            );
            expect(ref.current).toBeInstanceOf(HTMLElement);
        });
    });

    describe("Combobox behavior", () => {
        const FRUITS = ["Apple", "Banana", "Cherry"];

        function ComboboxHarness({ onValueChange }: { onValueChange: (value: string | null) => void }) {
            const [value, setValue] = React.useState<string | null>(null);
            const [open, setOpen] = React.useState(false);
            const [search, setSearch] = React.useState("");

            // Mirror the app usage sites: external filtering + `filter={null}`.
            const query = search.trim().toLowerCase();
            const items = query ? FRUITS.filter((fruit) => fruit.toLowerCase().includes(query)) : FRUITS;

            return (
                <Combobox
                    value={value}
                    onValueChange={(next) => {
                        setValue(next);
                        onValueChange(next);
                    }}
                    open={open}
                    onOpenChange={setOpen}
                    onInputValueChange={setSearch}
                    items={items}
                    filter={null}
                >
                    <ComboboxInput placeholder="Search fruit" showClear={!!value} />
                    <ComboboxContent>
                        <ComboboxEmpty>No fruit found.</ComboboxEmpty>
                        <ComboboxList>
                            {(fruit: string) => (
                                <ComboboxItem key={fruit} value={fruit}>
                                    {fruit}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            );
        }

        it("opens on focus, filters on type, and selects on click", async () => {
            const user = userEvent.setup();
            const onValueChange = jest.fn();
            render(<ComboboxHarness onValueChange={onValueChange} />);

            const input = screen.getByPlaceholderText("Search fruit");

            // Open: all three options are shown.
            await user.click(input);
            expect(await screen.findByText("Apple")).toBeInTheDocument();
            expect(screen.getByText("Banana")).toBeInTheDocument();
            expect(screen.getByText("Cherry")).toBeInTheDocument();

            // Type to filter down to a single option (external filtering via `items`).
            await user.type(input, "ban");
            expect(await screen.findByText("Banana")).toBeInTheDocument();
            expect(screen.queryByText("Apple")).not.toBeInTheDocument();
            expect(screen.queryByText("Cherry")).not.toBeInTheDocument();

            // Select via click: onValueChange fires and the field reflects the selection.
            await user.click(screen.getByText("Banana"));
            expect(onValueChange).toHaveBeenCalledWith("Banana");
            expect(input).toHaveValue("Banana");
        });
    });

    describe("Toaster", () => {
        it("renders without crashing", () => {
            const { container } = render(<Toaster />);
            // sonner v2 mounts a live-region <section> for the toaster.
            expect(container.querySelector("section")).toBeInTheDocument();
        });
    });
});
