import React from "react";
import { render } from "@testing-library/react";

import { StickyNoteModal, StickyNoteModalTranslationKeys } from "@/cmem/react-flow/StickyNoteModal/StickyNoteModal";

import "@testing-library/jest-dom";

const translate = (key: StickyNoteModalTranslationKeys) => key;

describe("StickyNoteModal", () => {
    /**
     * `StickyNoteModal` reads a default color from `noteColors[0]` in an effect, where
     * `noteColors = Object.entries(getColorConfiguration("stickynotes"))`. `getColorConfiguration`
     * is a fragile CSSOM scraper (see its own @deprecated docstring) that "silently returns
     * nothing" when the sticky-note color rules are not readable — a CORS-blocked cross-origin
     * stylesheet, async/late CSS chunk loading, or (here) a jsdom environment with no real CSS.
     * When the config is empty, `noteColors` is `[]`; the effect now guards the lookup with
     * `noteColors[0]?.[1]` so the modal renders (with no preselected color) instead of crashing.
     */
    it("renders even when the sticky-note color configuration scrapes empty", () => {
        expect(() =>
            render(<StickyNoteModal translate={translate} onClose={() => {}} onSubmit={() => {}} />),
        ).not.toThrow();
    });
});
