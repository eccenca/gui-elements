import React from "react";
import { render, RenderResult } from "@testing-library/react";

import "@testing-library/jest-dom";

import {
    StringPreviewContentBlobToggler,
    StringPreviewContentBlobTogglerProps,
} from "../StringPreviewContentBlobToggler";

import { Default as StringPreviewContentBlobTogglerStory } from "./../stories/StringPreviewContentBlobToggler.stories";

describe("StringPreviewContentBlobToggler", () => {
    const textMustExist = (queryByText: RenderResult["queryByText"], text: string) => {
        expect(queryByText(text, { exact: false })).not.toBeNull();
    };
    const textMustNotExist = (queryByText: RenderResult["queryByText"], text: string) => {
        expect(queryByText(text, { exact: false })).toBeNull();
    };
    it("should cut preview and show toggler to extend", () => {
        const { queryByText } = render(
            <StringPreviewContentBlobToggler
                {...(StringPreviewContentBlobTogglerStory.args as StringPreviewContentBlobTogglerProps)}
            />
        );
        textMustExist(queryByText, "A library for GUI elements.");
        textMustNotExist(
            queryByText,
            "In order to create graphical user interfaces, please have look at the documentation at"
        );
        textMustExist(queryByText, "show more");
    });
    it("should display full view if `startExtended` is enabled, and show toggler to reduce", () => {
        const { queryByText } = render(
            <StringPreviewContentBlobToggler
                {...(StringPreviewContentBlobTogglerStory.args as StringPreviewContentBlobTogglerProps)}
                startExtended
            />
        );
        textMustExist(
            queryByText,
            "In order to create graphical user interfaces, please have look at the documentation at"
        );
        textMustExist(queryByText, "show less");
    });
    it('should display only first content line on `useOnly={"firstNonEmptyLine"}`', () => {
        const { queryByText } = render(
            <StringPreviewContentBlobToggler
                {...(StringPreviewContentBlobTogglerStory.args as StringPreviewContentBlobTogglerProps)}
                useOnly={"firstNonEmptyLine"}
            />
        );
        textMustExist(queryByText, "A library for GUI elements.");
        textMustNotExist(queryByText, "In order to create");
    });
    it('should use first Markdown paragraph as preview content on `useOnly={"firstMarkdownSection"}` but shorten it', () => {
        const { queryByText } = render(
            <StringPreviewContentBlobToggler
                {...(StringPreviewContentBlobTogglerStory.args as StringPreviewContentBlobTogglerProps)}
                useOnly={"firstMarkdownSection"}
            />
        );
        textMustExist(queryByText, "A library for GUI elements.");
        textMustExist(queryByText, "In order to create");
        textMustNotExist(queryByText, "please have look at the documentation at");
    });
    it("should display full preview and no toggler if content is short enough", () => {
        const { queryByText } = render(
            <StringPreviewContentBlobToggler
                {...(StringPreviewContentBlobTogglerStory.args as StringPreviewContentBlobTogglerProps)}
                previewMaxLength={144}
            />
        );
        textMustExist(queryByText, "A library for GUI elements.");
        textMustExist(
            queryByText,
            "In order to create graphical user interfaces, please have look at the documentation at"
        );
        textMustNotExist(queryByText, "https://github.com/"); // test if Markdown was rendered
        textMustNotExist(queryByText, "show more");
    });
    it("should not use Markdown rendering on `renderPreviewAsMarkdown={false}`", () => {
        const { queryByText } = render(
            <StringPreviewContentBlobToggler
                {...(StringPreviewContentBlobTogglerStory.args as StringPreviewContentBlobTogglerProps)}
                previewMaxLength={144}
                renderPreviewAsMarkdown={false}
            />
        );
        textMustExist(queryByText, "A library for GUI elements.");
        textMustExist(
            queryByText,
            "In order to create graphical user interfaces, please have look at the documentation at"
        );
        textMustExist(queryByText, "https://github.com/"); // test if Markdown was rendered
        textMustExist(queryByText, "show more");
    });
});
