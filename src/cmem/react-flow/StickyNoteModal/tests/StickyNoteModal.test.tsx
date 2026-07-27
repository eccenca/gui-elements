import React from "react";
import { render } from "@testing-library/react";

import { StickyNoteModal, StickyNoteModalTranslationKeys } from "@/cmem/react-flow/StickyNoteModal/StickyNoteModal";

import "@testing-library/jest-dom";

const translate = (key: StickyNoteModalTranslationKeys) => key;

describe("StickyNoteModal", () => {
    /**
     * FIXME(real bug): `StickyNoteModal` reads `noteColors[0][1]` in an effect, where
     * `noteColors = Object.entries(getColorConfiguration("stickynotes"))`. `getColorConfiguration`
     * is a fragile CSSOM scraper (see its own @deprecated docstring) that "silently returns
     * nothing" when the sticky-note color rules are not readable — a CORS-blocked cross-origin
     * stylesheet, async/late CSS chunk loading, or (here) a jsdom environment with no real CSS.
     * When the config is empty, `noteColors` is `[]` and `noteColors[0][1]` throws
     * `TypeError: Cannot read properties of undefined (reading '1')`, crashing the whole modal.
     *
     * Correct behavior: the modal should render (with no preselected color / empty color list)
     * instead of crashing. This test pins that expectation and is marked `.failing` because the
     * component crashes today. Remove `.failing` once the guard (e.g. `noteColors[0]?.[1]`) lands.
     */
    it.failing("renders even when the sticky-note color configuration scrapes empty", () => {
        expect(() =>
            render(<StickyNoteModal translate={translate} onClose={() => {}} onSubmit={() => {}} />),
        ).not.toThrow();
    });
});
