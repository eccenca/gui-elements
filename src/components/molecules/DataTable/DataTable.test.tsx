import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { SortableColumnHeader } from "./SortableColumnHeader";
import { ValueChips } from "./ValueChips";

describe("SortableColumnHeader", () => {
    it("renders label, leading element and fires onToggle", () => {
        const onToggle = jest.fn();
        render(<SortableColumnHeader label="Name" sorted="asc" onToggle={onToggle} leading={<span>ico</span>} />);
        const button = screen.getByRole("button", { name: /Name/ });
        expect(screen.getByText("ico")).toBeInTheDocument();
        fireEvent.click(button);
        expect(onToggle).toHaveBeenCalledTimes(1);
    });
});

describe("ValueChips", () => {
    it("renders all values below the limit", () => {
        render(<ValueChips values={["a", "b"]} />);
        expect(screen.getByText("a")).toBeInTheDocument();
        expect(screen.getByText("b")).toBeInTheDocument();
        expect(screen.queryByText(/^\+/)).toBeNull();
    });

    it("caps at the limit with a +N overflow badge", () => {
        render(<ValueChips values={["a", "b", "c", "d"]} limit={2} />);
        expect(screen.getByText("a")).toBeInTheDocument();
        expect(screen.getByText("b")).toBeInTheDocument();
        expect(screen.queryByText("c")).toBeNull();
        expect(screen.getByText("+2")).toBeInTheDocument();
    });

    it("renders empty strings with the (overridable) empty label", () => {
        render(<ValueChips values={[""]} emptyLabel="leer" />);
        expect(screen.getByText("leer")).toBeInTheDocument();
    });
});
