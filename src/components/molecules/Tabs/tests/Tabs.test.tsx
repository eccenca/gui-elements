import React from "react";
import { fireEvent, render } from "@testing-library/react";

import "@testing-library/jest-dom";

import { Tabs } from "../Tabs";

/**
 * Radix `Tabs` selects a tab on `mousedown` (not on the trailing `click`) and activates on
 * focus in automatic mode. Firing a bare `click` therefore does NOT switch the tab. These
 * helpers reproduce a genuine pointer activation (`mousedown` + `mouseup` + `click`) and a
 * keyboard activation so the tests exercise the real selection path.
 */
const pointerActivate = (el: HTMLElement) => {
    fireEvent.mouseDown(el);
    fireEvent.mouseUp(el);
    fireEvent.click(el);
};

const tabButtons = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>("button[role=tab]"));

const makeTabs = () => [
    { id: "a", title: "A", panel: <div>PanelA</div> },
    { id: "b", title: "B", panel: <div>PanelB</div> },
    { id: "c", title: "C", panel: <div>PanelC</div> },
];

describe("Tabs", () => {
    describe("uncontrolled vs controlled", () => {
        it("uncontrolled: selecting a tab switches the active tab and reports prev id", () => {
            const onChange = jest.fn();
            const { container } = render(
                <Tabs id="t" tabs={makeTabs()} defaultSelectedTabId="a" onChange={onChange} />,
            );
            const [tabA, tabB] = tabButtons(container);
            expect(tabA).toHaveAttribute("aria-selected", "true");

            pointerActivate(tabB);

            // internal selection moves to B
            expect(tabB).toHaveAttribute("aria-selected", "true");
            expect(tabA).toHaveAttribute("aria-selected", "false");
            // onChange(newTabId, prevTabId, event) — prev is the previously active tab
            expect(onChange).toHaveBeenCalled();
            const [newId, prevId] = onChange.mock.calls[0];
            expect(newId).toBe("b");
            expect(prevId).toBe("a");
        });

        it("controlled: interaction does NOT move the selection itself but still reports the change", () => {
            const onChange = jest.fn();
            const { container } = render(<Tabs id="t" tabs={makeTabs()} selectedTabId="a" onChange={onChange} />);
            const [tabA, tabB] = tabButtons(container);

            pointerActivate(tabB);

            // controlled: the component honours `selectedTabId`, tab A stays selected
            expect(tabA).toHaveAttribute("aria-selected", "true");
            expect(tabB).toHaveAttribute("aria-selected", "false");
            // onChange still fires with the controlled prop as prevTabId
            const [newId, prevId] = onChange.mock.calls[0];
            expect(newId).toBe("b");
            expect(prevId).toBe("a");
        });

        it("hands numeric TabIds back to onChange unchanged (not stringified)", () => {
            const onChange = jest.fn();
            const numericTabs = [
                { id: 1, title: "One", panel: <div>One</div> },
                { id: 2, title: "Two", panel: <div>Two</div> },
            ];
            const { container } = render(
                <Tabs id="t" tabs={numericTabs} defaultSelectedTabId={1} onChange={onChange} />,
            );
            pointerActivate(tabButtons(container)[1]);
            const [newId, prevId] = onChange.mock.calls[0];
            expect(newId).toBe(2);
            expect(prevId).toBe(1);
            // strictly numbers, not the Radix string values
            expect(typeof newId).toBe("number");
            expect(typeof prevId).toBe("number");
        });
    });

    describe("onChange event argument", () => {
        it("keyboard activation hands over the real keydown event", () => {
            const onChange = jest.fn();
            const { container } = render(
                <Tabs id="t" tabs={makeTabs()} defaultSelectedTabId="a" onChange={onChange} />,
            );
            const tabB = tabButtons(container)[1];
            tabB.focus();
            fireEvent.keyDown(tabB, { key: "Enter" });

            expect(onChange).toHaveBeenCalledTimes(1);
            const event = onChange.mock.calls[0][2];
            // the captured event is the genuine React synthetic event of the activating interaction
            expect(event).toBeTruthy();
            expect(event.type).toBe("keydown");
            expect(event.nativeEvent).toBeInstanceOf(KeyboardEvent);
        });

        // Radix selects on `mousedown`; the component captures that press and buffers the change,
        // then flushes it to `onChange` from the trailing `click` so the callback receives the pointer
        // event that actually completed THIS selection (not a stale/empty one).
        it("pointer activation hands over the click event that triggered THIS selection", () => {
            const onChange = jest.fn();
            const { container } = render(
                <Tabs id="t" tabs={makeTabs()} defaultSelectedTabId="a" onChange={onChange} />,
            );
            const tabB = tabButtons(container)[1];
            pointerActivate(tabB);

            const event = onChange.mock.calls[0][2];
            expect(event).toBeTruthy();
            expect(event.type).toBe("click");
            expect(event.target).toBe(tabB);
        });
    });

    describe("renderActiveTabPanelOnly / forceMount", () => {
        it("by default keeps inactive panels mounted (but hidden) in the DOM", () => {
            const { container } = render(<Tabs id="t" tabs={makeTabs()} defaultSelectedTabId="a" />);
            // every panel's content is present, even the inactive ones
            expect(container).toHaveTextContent("PanelA");
            expect(container).toHaveTextContent("PanelB");
            expect(container).toHaveTextContent("PanelC");
            // inactive panels carry the `data-[state=inactive]:hidden` recipe and inactive state
            const inactivePanel = container.querySelector(
                "[data-slot=tabs-content][data-state=inactive]",
            ) as HTMLElement;
            expect(inactivePanel).toBeTruthy();
            expect(inactivePanel.className).toContain("data-[state=inactive]:hidden");
        });

        it("renderActiveTabPanelOnly unmounts inactive panel content and hides the node", () => {
            const { container } = render(
                <Tabs id="t" tabs={makeTabs()} defaultSelectedTabId="a" renderActiveTabPanelOnly />,
            );
            expect(container).toHaveTextContent("PanelA");
            expect(container).not.toHaveTextContent("PanelB");
            expect(container).not.toHaveTextContent("PanelC");
            const inactivePanel = container.querySelector(
                "[data-slot=tabs-content][data-state=inactive]",
            ) as HTMLElement;
            expect(inactivePanel).toBeTruthy();
            // Radix hides the force-unmounted panel via the `hidden` attribute
            expect(inactivePanel).toHaveAttribute("hidden");
            // and the hiding is NOT delegated to the CSS recipe in this mode
            expect(inactivePanel.className).not.toContain("data-[state=inactive]:hidden");
        });

        it("toggling renderActiveTabPanelOnly on removes the inactive panel content", () => {
            const { container, rerender } = render(<Tabs id="t" tabs={makeTabs()} defaultSelectedTabId="a" />);
            expect(container).toHaveTextContent("PanelB");
            rerender(<Tabs id="t" tabs={makeTabs()} defaultSelectedTabId="a" renderActiveTabPanelOnly />);
            expect(container).not.toHaveTextContent("PanelB");
        });
    });
});
