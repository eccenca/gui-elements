import { act, renderHook } from "@testing-library/react";

import { useModalContext } from "../ModalContext";

describe("useModalContext", () => {
    it("should provide no stack as long as no modal is open", () => {
        const { result } = renderHook(() => useModalContext());
        expect(result.current.openModalStack()).toBeUndefined();
    });
    it("should provide the stack synchronously, even directly after a change", () => {
        const { result } = renderHook(() => useModalContext());
        act(() => {
            result.current.setModalOpen("first", true);
            // the stack must be readable without waiting for a re-render
            expect(result.current.openModalStack()).toEqual(["first"]);
            result.current.setModalOpen("second", true);
            expect(result.current.openModalStack()).toEqual(["first", "second"]);
        });
        expect(result.current.openModalStack()).toEqual(["first", "second"]);
    });
    it("should order the stack by the time the modals were opened", () => {
        const { result } = renderHook(() => useModalContext());
        act(() => {
            ["first", "second", "third"].forEach((modalId) => result.current.setModalOpen(modalId, true));
        });
        expect(result.current.openModalStack()).toEqual(["first", "second", "third"]);
    });
    it("should consider modals as closed that were opened after a closed modal", () => {
        const { result } = renderHook(() => useModalContext());
        act(() => {
            ["first", "second", "third"].forEach((modalId) => result.current.setModalOpen(modalId, true));
            result.current.setModalOpen("second", false);
        });
        expect(result.current.openModalStack()).toEqual(["first"]);
    });
    it("should not register the same modal twice", () => {
        const { result } = renderHook(() => useModalContext());
        act(() => {
            result.current.setModalOpen("same", true);
            result.current.setModalOpen("same", true);
        });
        expect(result.current.openModalStack()).toEqual(["same"]);
    });
    it("should provide a changed context value whenever the stack changed", () => {
        const { result } = renderHook(() => useModalContext());
        const contextValueBefore = result.current;
        act(() => {
            result.current.setModalOpen("first", true);
        });
        expect(result.current).not.toBe(contextValueBefore);
    });
    it("should keep the context value if nothing changed, so consumers are not re-rendered", () => {
        const { result } = renderHook(() => useModalContext());
        act(() => {
            result.current.setModalOpen("first", true);
        });
        const contextValueBefore = result.current;
        act(() => {
            // closing a modal that was never registered as open changes nothing
            result.current.setModalOpen("unknown", false);
        });
        expect(result.current).toBe(contextValueBefore);
        expect(result.current.openModalStack()).toEqual(["first"]);
    });
});
