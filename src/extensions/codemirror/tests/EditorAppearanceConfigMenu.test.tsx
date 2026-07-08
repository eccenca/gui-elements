import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";
import { EditorAppearanceConfigMenu } from "../toolbars/EditorAppearanceConfigMenu";

const contextOverlayClass = `${eccgui}-contextoverlay`;

describe("EditorAppearanceConfigMenu", () => {
    it("renders menu items for each config property, using key as fallback label", async () => {
        const config = { wrapLines: true, preventLineNumbers: false };
        const setConfig = jest.fn();

        const { container } = render(<EditorAppearanceConfigMenu config={config} setConfig={setConfig} />);

        fireEvent.click(container.getElementsByClassName(contextOverlayClass)[0]);

        expect(await screen.findByText("wrapLines")).toBeVisible();
        expect(await screen.findByText("preventLineNumbers")).toBeVisible();
    });

    it("uses configPropertyTranslate for menu item labels", async () => {
        const config = { wrapLines: true, preventLineNumbers: false };
        const setConfig = jest.fn();
        const translate = (key: string) => `Label_${key}` as string | false;

        const { container } = render(
            <EditorAppearanceConfigMenu config={config} setConfig={setConfig} configPropertyTranslate={translate} />,
        );

        fireEvent.click(container.getElementsByClassName(contextOverlayClass)[0]);

        expect(await screen.findByText("Label_wrapLines")).toBeVisible();
        expect(await screen.findByText("Label_preventLineNumbers")).toBeVisible();
    });

    it("calls setConfig with the toggled value when a menu item is clicked", async () => {
        const config = { wrapLines: true, preventLineNumbers: false };
        const setConfig = jest.fn();

        const { container } = render(<EditorAppearanceConfigMenu config={config} setConfig={setConfig} />);

        fireEvent.click(container.getElementsByClassName(contextOverlayClass)[0]);
        const wrapLinesItem = await screen.findByText("wrapLines");
        fireEvent.click(wrapLinesItem);

        expect(setConfig).toHaveBeenCalledWith({ wrapLines: false, preventLineNumbers: false });
    });

    it("menu trigger is disabled when all config properties are locked", () => {
        const config = { wrapLines: true, preventLineNumbers: false };
        const configLocked = { wrapLines: true, preventLineNumbers: true };
        const setConfig = jest.fn();

        const { container } = render(
            <EditorAppearanceConfigMenu config={config} configLocked={configLocked} setConfig={setConfig} />,
        );

        const trigger = container.getElementsByClassName(contextOverlayClass)[0].querySelector("button");
        expect(trigger).toBeDisabled();
    });

    it("menu trigger is enabled when not all config properties are locked", () => {
        const config = { wrapLines: true, preventLineNumbers: false };
        const configLocked = { wrapLines: true }; // only one locked
        const setConfig = jest.fn();

        const { container } = render(
            <EditorAppearanceConfigMenu config={config} configLocked={configLocked} setConfig={setConfig} />,
        );

        const trigger = container.getElementsByClassName(contextOverlayClass)[0].querySelector("button");
        expect(trigger).not.toBeDisabled();
    });

    it("locked config property has a disabled menu item", async () => {
        const config = { wrapLines: true, preventLineNumbers: false };
        const configLocked = { wrapLines: true };
        const setConfig = jest.fn();

        const { container } = render(
            <EditorAppearanceConfigMenu config={config} configLocked={configLocked} setConfig={setConfig} />,
        );

        fireEvent.click(container.getElementsByClassName(contextOverlayClass)[0]);

        const wrapLinesItem = await screen.findByText("wrapLines");
        expect(wrapLinesItem.closest("[aria-disabled='true']")).not.toBeNull();
    });

    it("unlocked config property has an enabled menu item", async () => {
        const config = { wrapLines: true, preventLineNumbers: false };
        const configLocked = { wrapLines: true }; // only wrapLines is locked
        const setConfig = jest.fn();

        const { container } = render(
            <EditorAppearanceConfigMenu config={config} configLocked={configLocked} setConfig={setConfig} />,
        );

        fireEvent.click(container.getElementsByClassName(contextOverlayClass)[0]);

        const preventLineNumbersItem = await screen.findByText("preventLineNumbers");
        expect(preventLineNumbersItem.closest("[aria-disabled='true']")).toBeNull();
    });

    it("selected config property is marked as selected in the menu", async () => {
        const config = { wrapLines: true, preventLineNumbers: false };
        const setConfig = jest.fn();

        const { container } = render(<EditorAppearanceConfigMenu config={config} setConfig={setConfig} />);

        fireEvent.click(container.getElementsByClassName(contextOverlayClass)[0]);

        const wrapLinesItem = await screen.findByText("wrapLines");
        expect(wrapLinesItem.closest("[aria-selected='true']")).not.toBeNull();
    });

    it("unselected config property is not marked as selected in the menu", async () => {
        const config = { wrapLines: true, preventLineNumbers: false };
        const setConfig = jest.fn();

        const { container } = render(<EditorAppearanceConfigMenu config={config} setConfig={setConfig} />);

        fireEvent.click(container.getElementsByClassName(contextOverlayClass)[0]);

        const preventLineNumbersItem = await screen.findByText("preventLineNumbers");
        expect(preventLineNumbersItem.closest("[aria-selected='true']")).toBeNull();
    });
});
