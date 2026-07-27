import React from "react";
import { act, fireEvent, render, renderHook } from "@testing-library/react";

import "@testing-library/jest-dom";

import { Pagination, usePagination } from "../Pagination";

const pageSizeSelect = (c: HTMLElement) => c.querySelector(".eccgui-pagination__pagesize") as HTMLSelectElement;
const pageSelect = (c: HTMLElement) => c.querySelector(".eccgui-pagination__pageselect") as HTMLSelectElement;
const infoText = (c: HTMLElement) => c.querySelector(".eccgui-pagination__items-count")?.textContent;

describe("Pagination", () => {
    describe("page size change", () => {
        it("resets to the first page and reports the new page + size", () => {
            const onChange = jest.fn();
            const { container } = render(
                <Pagination page={3} pageSize={10} pageSizes={[10, 25, 50]} totalItems={100} onChange={onChange} />,
            );
            expect(pageSelect(container).value).toBe("3");

            fireEvent.change(pageSizeSelect(container), { target: { value: "25" } });

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith({ page: 1, pageSize: 25 });
            // page selector snaps back to page 1 and recomputes the number of pages (100 / 25 = 4)
            expect(pageSelect(container).value).toBe("1");
            expect(pageSizeSelect(container).value).toBe("25");
            expect(pageSelect(container).options).toHaveLength(4);
        });

        it("resets the page even after the user paged forward first (uncontrolled)", () => {
            const onChange = jest.fn();
            const { container } = render(
                <Pagination pageSize={10} pageSizes={[10, 25]} totalItems={100} onChange={onChange} />,
            );
            // navigate to page 2 via the next arrow
            fireEvent.click(container.querySelector(".eccgui-pagination__control-buttons button:last-child")!);
            expect(pageSelect(container).value).toBe("2");

            fireEvent.change(pageSizeSelect(container), { target: { value: "25" } });
            expect(onChange).toHaveBeenLastCalledWith({ page: 1, pageSize: 25 });
            expect(pageSelect(container).value).toBe("1");
        });

        it("falls back to the first available page size when pageSize is not in pageSizes", () => {
            const { container } = render(
                <Pagination pageSize={999} pageSizes={[10, 25]} totalItems={100} onChange={jest.fn()} />,
            );
            expect(pageSizeSelect(container).value).toBe("10");
        });
    });

    describe("controlled re-sync", () => {
        it("re-syncs the page when the controlled page prop changes", () => {
            const { container, rerender } = render(
                <Pagination page={1} pageSize={10} pageSizes={[10, 25]} totalItems={100} onChange={jest.fn()} />,
            );
            expect(pageSelect(container).value).toBe("1");
            rerender(<Pagination page={4} pageSize={10} pageSizes={[10, 25]} totalItems={100} onChange={jest.fn()} />);
            expect(pageSelect(container).value).toBe("4");
        });

        it("re-syncs the page size when the controlled pageSize prop changes", () => {
            const { container, rerender } = render(
                <Pagination page={1} pageSize={10} pageSizes={[10, 25]} totalItems={100} onChange={jest.fn()} />,
            );
            expect(pageSizeSelect(container).value).toBe("10");
            rerender(<Pagination page={1} pageSize={25} pageSizes={[10, 25]} totalItems={100} onChange={jest.fn()} />);
            expect(pageSizeSelect(container).value).toBe("25");
            // page count recomputes to the new size
            expect(pageSelect(container).options).toHaveLength(4);
        });
    });

    describe("totalItems shrinking below the current page", () => {
        it("clamps the info text and disables the forward arrow (stays consistent)", () => {
            const { container, rerender } = render(
                <Pagination page={5} pageSize={10} pageSizes={[10]} totalItems={100} onChange={jest.fn()} />,
            );
            expect(infoText(container)).toBe("41–50 of 100");

            // total shrinks so that page 5 no longer exists (only 2 pages of 10 remain)
            rerender(<Pagination page={5} pageSize={10} pageSizes={[10]} totalItems={20} onChange={jest.fn()} />);
            // displayed range is clamped to the (now smaller) total instead of showing 41–50
            expect(infoText(container)).toBe("20–20 of 20");
            // the forward arrow is disabled because the page is at/after the last page
            const forwardBtn = container.querySelector(
                ".eccgui-pagination__control-buttons button:last-child",
            ) as HTMLButtonElement;
            expect(forwardBtn).toBeDisabled();
        });

        it("usePagination.onTotalChange resets the current page to 1 when the total changes", () => {
            const { result } = renderHook(() => usePagination({ pageSizes: [5, 10] }));
            act(() => result.current[2](100)); // onTotalChange
            act(() => result.current[1].props.onChange({ page: 4, pageSize: 10 }));
            expect(result.current[0]).toMatchObject({ total: 100, current: 4, limit: 10 });

            // shrinking the total below the current page resets to page 1 → consistent state
            act(() => result.current[2](12));
            expect(result.current[0]).toMatchObject({ total: 12, current: 1, limit: 10 });
        });
    });

    describe("usePagination hook wiring", () => {
        it("defaults limit to the smallest page size and forwards page changes", () => {
            const { result } = renderHook(() => usePagination({ pageSizes: [5, 10, 25] }));
            expect(result.current[0]).toMatchObject({ current: 1, limit: 5, total: 0 });

            act(() => result.current[1].props.onChange({ page: 3, pageSize: 25 }));
            expect(result.current[0]).toMatchObject({ current: 3, limit: 25 });
        });

        it("honours initialPageSize", () => {
            const { result } = renderHook(() => usePagination({ pageSizes: [5, 10, 25], initialPageSize: 10 }));
            expect(result.current[0].limit).toBe(10);
        });
    });
});
