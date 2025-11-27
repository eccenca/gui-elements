import React from "react";
import {render, RenderResult} from "@testing-library/react";

import "@testing-library/jest-dom";

import { Markdown, TextReducer } from "./../../";
import { Default as TextReducerStory } from "./TextReducer.stories";

describe("TextReducer", () => {
    const textMustExist = (queryByText: RenderResult["queryByText"], text: string) => {
        expect(queryByText(text, { exact: false })).not.toBeNull();
    }
    const textMustNotExist = (queryByText: RenderResult["queryByText"], text: string) => {
        expect(queryByText(text, { exact: false })).toBeNull();
    }
    it("should display encoded HTML entities by default if they are used in the transformed markup", () => {
        const { queryByText } = render(<TextReducer {...TextReducerStory.args} />);
        textMustExist(queryByText, "&#x27;entities&#x27; &amp; &quot;quotes&quot;");
        textMustNotExist(queryByText, `'entities' & "quotes"`);
    });
    it("should not display encoded HTML entities if `decodeHtmlEntities` is enabled", () => {
        const { queryByText } = render(<TextReducer {...TextReducerStory.args} decodeHtmlEntities />);
        textMustNotExist(queryByText, "&#x27;entities&#x27; &amp; &quot;quotes&quot;");
        textMustExist(queryByText, `'entities' & "quotes"`);
    });
    it("should only decode if correct encoded HTML entities are found (strict mode)", () => {
        const { queryByText } = render(
            <TextReducer decodeHtmlEntities>
                <Markdown>&</Markdown>&amp foo&ampbar
            </TextReducer>
        );
        textMustExist(queryByText, "& &amp foo&ampbar");
        textMustNotExist(queryByText, "& & foo&ampbar");
    });
    it("should allow decoding non-strict encoded HTML entities", () => {
        const { queryByText } = render(
            <TextReducer decodeHtmlEntities decodeHtmlEntitiesOptions={{ strict: false }}>
                <Markdown>&</Markdown>&amp foo&ampbar
            </TextReducer>
        );
        textMustNotExist(queryByText, "& &amp foo&ampbar");
        textMustExist(queryByText, "& & foo&ampbar");
    });
});
