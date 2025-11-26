import React from "react";
import { render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { Markdown, TextReducer } from "./../../";
import { Default as TextReducerStory } from "./TextReducer.stories";

describe("TextReducer", () => {
    it("should display encoded HTML entities by default if they are used in the transformed markup", () => {
        const { queryByText } = render(<TextReducer {...TextReducerStory.args} />);
        expect(queryByText("&#x27;entities&#x27; &amp; &quot;quotes&quot;", { exact: false })).not.toBeNull();
        expect(queryByText(`'entities' & "quotes"`, { exact: false })).toBeNull();
    });
    it("should not display encoded HTML entities if `decodeHtmlEntities` is enabled", () => {
        const { queryByText } = render(<TextReducer {...TextReducerStory.args} decodeHtmlEntities />);
        expect(queryByText("&#x27;entities&#x27; &amp; &quot;quotes&quot;", { exact: false })).toBeNull();
        expect(queryByText(`'entities' & "quotes"`, { exact: false })).not.toBeNull();
    });
    it("should only decode if correct encoded HTML entities are found (strict mode)", () => {
        const { queryByText } = render(
            <TextReducer decodeHtmlEntities>
                <Markdown>&</Markdown>&amp foo&ampbar
            </TextReducer>
        );
        expect(queryByText("& &amp foo&ampbar", { exact: false })).not.toBeNull();
        expect(queryByText("& & foo&ampbar", { exact: false })).toBeNull();
    });
    it("should allow decoding non-strict encoded HTML entities", () => {
        const { queryByText } = render(
            <TextReducer decodeHtmlEntities decodeHtmlEntitiesOptions={{ strict: false }}>
                <Markdown>&</Markdown>&amp foo&ampbar
            </TextReducer>
        );
        expect(queryByText("& &amp foo&ampbar", { exact: false })).toBeNull();
        expect(queryByText("& & foo&ampbar", { exact: false })).not.toBeNull();
    });
});
