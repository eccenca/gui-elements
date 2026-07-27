import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { FilterChips } from "../FilterChips";

describe("FilterChips", () => {
    const chips = [
        { id: "all", label: "All" },
        { id: "comparison", label: "Comparison", activeColor: "#745a85" },
        { id: "broken", label: "Broken", activeColor: "not-a-color" },
    ];

    it("renders all chips and marks the selected one", () => {
        render(<FilterChips chips={chips} selectedChipId="all" onChange={jest.fn()} />);
        expect(screen.getByRole("radio", { name: "All" }).getAttribute("data-state")).toBe("on");
        expect(screen.getByRole("radio", { name: "Comparison" }).getAttribute("data-state")).toBe("off");
        expect(screen.getByRole("radio", { name: "Broken" }).getAttribute("data-state")).toBe("off");
    });

    it("fires onChange with the chip id when another chip is clicked", () => {
        const onChange = jest.fn();
        render(<FilterChips chips={chips} selectedChipId="all" onChange={onChange} />);
        fireEvent.click(screen.getByRole("radio", { name: "Comparison" }));
        expect(onChange).toHaveBeenCalledWith("comparison");
    });

    it("keeps exactly one chip selected: re-clicking the selected chip is a no-op", () => {
        const onChange = jest.fn();
        render(<FilterChips chips={chips} selectedChipId="all" onChange={onChange} />);
        fireEvent.click(screen.getByRole("radio", { name: "All" }));
        expect(onChange).not.toHaveBeenCalled();
    });

    it("tints only the selected chip with its activeColor and derives a readable text color", () => {
        render(<FilterChips chips={chips} selectedChipId="comparison" onChange={jest.fn()} />);
        const selected = screen.getByRole("radio", { name: "Comparison" });
        expect(selected.style.backgroundColor).toBe("rgb(116, 90, 133)");
        expect(selected.style.color).not.toBe("");
        // unselected chips carry no inline tint, even if they define an activeColor
        expect(screen.getByRole("radio", { name: "All" }).style.backgroundColor).toBe("");
    });

    it("falls back to the neutral selected style for invalid activeColor values", () => {
        render(<FilterChips chips={chips} selectedChipId="broken" onChange={jest.fn()} />);
        expect(screen.getByRole("radio", { name: "Broken" }).style.backgroundColor).toBe("");
    });

    it("passes the test id through to the group", () => {
        render(<FilterChips chips={chips} selectedChipId="all" onChange={jest.fn()} data-test-id="my-chips" />);
        expect(screen.getByRole("radiogroup").getAttribute("data-test-id")).toBe("my-chips");
    });
});
