import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { SuggestField } from "./AutoCompleteField";

describe("SuggestField", () => {
    it("renders suggestions as listbox options", async () => {
        render(
            <SuggestField<string, string>
                onSearch={() => ["Alpha"]}
                itemRenderer={(item) => item}
                itemValueRenderer={(item) => item}
                itemValueSelector={(item) => item}
                itemValueString={(item) => item}
                noResultText="No results"
            />,
        );

        fireEvent.focus(screen.getByRole("combobox"));

        const listbox = await screen.findByRole("listbox");
        expect(listbox.querySelectorAll('[role="option"]')).toHaveLength(1);
        expect(listbox.querySelectorAll('[role="menuitem"]')).toHaveLength(0);
    });

    it("ignores an old result as soon as the query changes", async () => {
        jest.useFakeTimers();
        try {
            let resolveFirst!: (items: string[]) => void;
            const first = new Promise<string[]>((resolve) => {
                resolveFirst = resolve;
            });
            const onSearch = jest.fn((query: string) => (query === "first" ? first : Promise.resolve(["New choice"])));
            render(
                <SuggestField<string, string>
                    onSearch={onSearch}
                    itemRenderer={(item) => item}
                    itemValueRenderer={(item) => item}
                    itemValueSelector={(item) => item}
                    itemValueString={(item) => item}
                    noResultText="No results"
                />,
            );
            const input = screen.getByRole("combobox");
            act(() => input.focus());
            fireEvent.change(input, { target: { value: "first" } });
            await act(async () => jest.advanceTimersByTime(200));
            expect(onSearch).toHaveBeenCalledTimes(1);

            fireEvent.change(input, { target: { value: "second" } });
            await act(async () => resolveFirst(["Old choice"]));
            expect(onSearch).toHaveBeenCalledTimes(1);
            expect(screen.queryByRole("option", { name: "Old choice" })).not.toBeInTheDocument();
            expect(screen.getByRole("progressbar")).toBeVisible();

            await act(async () => jest.advanceTimersByTime(200));
            expect(screen.getByRole("option", { name: "New choice" })).toBeVisible();
        } finally {
            jest.useRealTimers();
        }
    });

    it("does not append a pending page to the next search", async () => {
        jest.useFakeTimers();
        try {
            let resolvePage!: (items: string[]) => void;
            const page = new Promise<string[]>((resolve) => {
                resolvePage = resolve;
            });
            const loadMoreResults = jest.fn(() => page);
            render(
                <SuggestField<string, string>
                    onSearch={(query) => (query ? ["Current choice"] : ["Initial choice"])}
                    loadMoreResults={loadMoreResults}
                    itemRenderer={(item) => item}
                    itemValueRenderer={(item) => item}
                    itemValueSelector={(item) => item}
                    itemValueString={(item) => item}
                    noResultText="No results"
                />,
            );
            const input = screen.getByRole("combobox");
            act(() => input.focus());
            await act(async () => jest.advanceTimersByTime(200));

            const listbox = screen.getByRole("listbox");
            fireEvent.scroll(listbox);
            fireEvent.scroll(listbox);
            expect(loadMoreResults).toHaveBeenCalledTimes(1);
            fireEvent.change(input, { target: { value: "next" } });
            await act(async () => jest.advanceTimersByTime(200));
            expect(screen.getByRole("option", { name: "Current choice" })).toBeVisible();

            await act(async () => resolvePage(["Stale page"]));
            expect(screen.queryByRole("option", { name: "Stale page" })).not.toBeInTheDocument();
            expect(screen.getByRole("option", { name: "Current choice" })).toBeVisible();
        } finally {
            jest.useRealTimers();
        }
    });
});
