import React from "react";
import { act, fireEvent, render } from "@testing-library/react";

import "@testing-library/jest-dom";

import {
    DataTableRenderProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
} from "../index";

interface Person {
    id: string;
    name: string;
    n: string;
}

/**
 * Renders a real data table and exposes both the rendered order and the latest render-prop
 * bag so the headless sort engine can be exercised through its public contract.
 */
const renderTable = (props: {
    rows: Person[];
    headers: { key: string; header: React.ReactNode; isSortable?: boolean }[];
    locale?: string;
    sortRow?: (a: unknown, b: unknown, opts: any) => number;
    isSortable?: boolean;
}) => {
    const orders: string[][] = [];
    let renderProps: DataTableRenderProps<Person> | null = null;
    const utils = render(
        <TableContainer<Person>
            rows={props.rows}
            headers={props.headers}
            locale={props.locale}
            sortRow={props.sortRow}
            isSortable={props.isSortable}
        >
            {(rp: DataTableRenderProps<Person>) => {
                renderProps = rp;
                orders.push(rp.rows.map((r) => r.name));
                return (
                    <Table {...rp.getTableProps()}>
                        <TableHead>
                            <TableRow>
                                {rp.headers.map((header) => (
                                    <TableHeader
                                        {...rp.getHeaderProps({ header, isSortable: true })}
                                        key={header.key}
                                        data-test-id={`th-${header.key}`}
                                    >
                                        {header.header}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rp.rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );
            }}
        </TableContainer>,
    );
    return { ...utils, orders, getRenderProps: () => renderProps! };
};

describe("TableContainer sort engine", () => {
    const rows: Person[] = [
        { id: "1", name: "bravo", n: "10" },
        { id: "2", name: "alpha", n: "9" },
        { id: "3", name: "charlie", n: "2" },
    ];
    const headers = [
        { key: "name", header: "Name" },
        { key: "n", header: "N" },
    ];

    // The sortable header spreads passthrough props (incl. `data-test-id`) onto its inner
    // `<button>`, so the sort button is looked up by test id and the `<th>` is its ancestor.
    const sortButton = (c: HTMLElement, key: string) =>
        c.querySelector(`button[data-test-id='th-${key}']`) as HTMLButtonElement;
    const headerCell = (c: HTMLElement, key: string) => sortButton(c, key).closest("th") as HTMLElement;

    it("cycles a header NONE -> ASC -> DESC -> NONE on repeated clicks", () => {
        const { container, orders } = renderTable({ rows, headers });

        expect(orders[orders.length - 1]).toEqual(["bravo", "alpha", "charlie"]);
        expect(headerCell(container, "name")).toHaveAttribute("aria-sort", "none");

        fireEvent.click(sortButton(container, "name"));
        expect(orders[orders.length - 1]).toEqual(["alpha", "bravo", "charlie"]);
        expect(headerCell(container, "name")).toHaveAttribute("aria-sort", "ascending");

        fireEvent.click(sortButton(container, "name"));
        expect(orders[orders.length - 1]).toEqual(["charlie", "bravo", "alpha"]);
        expect(headerCell(container, "name")).toHaveAttribute("aria-sort", "descending");

        fireEvent.click(sortButton(container, "name"));
        // back to the untouched input order
        expect(orders[orders.length - 1]).toEqual(["bravo", "alpha", "charlie"]);
        expect(headerCell(container, "name")).toHaveAttribute("aria-sort", "none");
    });

    it("switching to a different header starts that column fresh at ASC", () => {
        const { container, orders } = renderTable({ rows, headers });

        fireEvent.click(sortButton(container, "name")); // name ASC
        fireEvent.click(sortButton(container, "name")); // name DESC
        fireEvent.click(sortButton(container, "n")); // switch to n -> ASC

        // numeric-aware default compare orders "2" < "9" < "10" (not lexicographically)
        expect(orders[orders.length - 1]).toEqual(["charlie", "alpha", "bravo"]);
        expect(headerCell(container, "n")).toHaveAttribute("aria-sort", "ascending");
        // the previous sort header is reset
        expect(headerCell(container, "name")).toHaveAttribute("aria-sort", "none");
    });

    it("default comparator is locale-aware and numeric-aware", () => {
        const localeRows: Person[] = [
            { id: "1", name: "z", n: "" },
            { id: "2", name: "ä", n: "" },
            { id: "3", name: "a", n: "" },
        ];
        const { getRenderProps, orders } = renderTable({
            rows: localeRows,
            headers: [{ key: "name", header: "Name" }],
            locale: "de",
        });
        act(() => getRenderProps().sortBy("name"));
        // German collation sorts "ä" between "a" and "z", not after "z" as a raw codepoint sort would
        expect(orders[orders.length - 1]).toEqual(["a", "ä", "z"]);
    });

    it("uses a custom sortRow comparator and passes it the engine options", () => {
        const sortRow = jest.fn(
            (a: unknown, b: unknown) =>
                // always sort descending by string length regardless of direction
                String(b).length - String(a).length,
        );
        const lenRows: Person[] = [
            { id: "1", name: "bb", n: "" },
            { id: "2", name: "aaaa", n: "" },
            { id: "3", name: "c", n: "" },
        ];
        const { getRenderProps, orders } = renderTable({
            rows: lenRows,
            headers: [{ key: "name", header: "Name" }],
            locale: "fr",
            sortRow,
        });
        act(() => getRenderProps().sortBy("name"));

        expect(orders[orders.length - 1]).toEqual(["aaaa", "bb", "c"]);
        expect(sortRow).toHaveBeenCalled();
        const opts = sortRow.mock.calls[0][2];
        expect(opts).toMatchObject({ key: "name", sortDirection: "ASC", locale: "fr" });
        expect(opts.sortStates).toMatchObject({ NONE: "NONE", ASC: "ASC", DESC: "DESC" });
        expect(typeof opts.compare).toBe("function");
    });

    describe("render-prop contract shape", () => {
        it("getHeaderProps returns the sort wiring and forwards unknown props", () => {
            const { getRenderProps } = renderTable({ rows, headers });
            const onClick = jest.fn();
            const hp = getRenderProps().getHeaderProps({
                header: headers[0],
                isSortable: true,
                onClick,
                "data-custom": "keep",
            } as any);

            expect(hp).toMatchObject({
                key: "name",
                isSortable: true,
                isSortHeader: false,
                sortDirection: "NONE",
                "data-custom": "keep",
            });
            expect(typeof hp.onClick).toBe("function");
            // the header key and the consumer `onClick` callback are both wired through
            act(() => hp.onClick({} as React.MouseEvent<HTMLButtonElement>));
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onClick.mock.calls[0][1]).toMatchObject({ sortHeaderKey: "name", sortDirection: "ASC" });
        });

        it("getRowProps returns expansion/selection wiring and forwards unknown props", () => {
            const selRows: Person[] = [{ id: "1", name: "a", n: "" }];
            const { getRenderProps } = renderTable({ rows: selRows, headers });
            const rp = getRenderProps();
            const rowProps = rp.getRowProps({ row: rp.rows[0], "data-custom": "keep" } as any);

            expect(rowProps).toMatchObject({
                key: "1",
                isExpanded: false,
                "data-custom": "keep",
            });
            expect(typeof rowProps.onExpand).toBe("function");
            expect("isSelected" in rowProps).toBe(true);
        });

        it("getTableProps forwards the table density", () => {
            const { getRenderProps } = renderTable({ rows, headers });
            expect(getRenderProps().getTableProps()).toMatchObject({ size: "medium" });
        });
    });

    it("expandRow / expandAll toggle the expansion state on the rows bag", () => {
        const { getRenderProps } = renderTable({ rows, headers });
        act(() => getRenderProps().expandRow("2"));
        expect(getRenderProps().rows.find((r) => r.id === "2")!.isExpanded).toBe(true);
        expect(getRenderProps().rows.find((r) => r.id === "1")!.isExpanded).toBe(false);

        act(() => getRenderProps().expandAll());
        expect(getRenderProps().rows.every((r) => r.isExpanded)).toBe(true);

        act(() => getRenderProps().expandAll());
        expect(getRenderProps().rows.every((r) => r.isExpanded)).toBe(false);
    });
});
