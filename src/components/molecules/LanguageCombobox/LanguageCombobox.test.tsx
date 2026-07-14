import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { LanguageCombobox } from "./LanguageCombobox";
import { languageTags } from "./languageTags";

describe("LanguageCombobox", () => {
    it("ships the full ISO 639-1 default tag list", () => {
        expect(languageTags.length).toBeGreaterThan(150);
        expect(languageTags.some((tag) => tag.code === "en")).toBe(true);
        expect(languageTags.some((tag) => tag.code === "de")).toBe(true);
    });

    it("renders the search input with the (overridable) placeholder", () => {
        render(<LanguageCombobox value="" onSelect={jest.fn()} searchPlaceholder="Sprache suchen…" />);
        expect(screen.getByPlaceholderText("Sprache suchen…")).toBeInTheDocument();
    });

    it("uses the English default placeholder", () => {
        render(<LanguageCombobox value="" onSelect={jest.fn()} />);
        expect(screen.getByPlaceholderText("Search language… e.g. en or en-GB")).toBeInTheDocument();
    });
});
