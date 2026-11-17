import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

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
});
