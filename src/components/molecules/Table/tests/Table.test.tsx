import React from "react";
import { fireEvent, render } from "@testing-library/react";

import {
    DataTableRenderProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableExpandedRow,
    TableExpandHeader,
    TableExpandRow,
    TableHead,
    TableHeader,
    TableRow,
} from "../index";

describe("Table", () => {
    it("renders the data-table render prop contract with sorting", () => {
        const rows = [
            { id: "1", name: "bravo" },
            { id: "2", name: "alpha" },
        ];
        const headers = [{ key: "name", header: "Name" }];
        const seen: string[][] = [];
        const { container } = render(
            <TableContainer rows={rows} headers={headers}>
                {({ rows: r, headers: h, getHeaderProps, getTableProps }: DataTableRenderProps<any, any>) => {
                    seen.push(r.map((x: any) => x.name));
                    return (
                        <Table {...getTableProps()} size="medium">
                            <TableHead>
                                <TableRow>
                                    {h.map((header) => (
                                        <TableHeader
                                            {...getHeaderProps({ header, isSortable: true })}
                                            key={header.key}
                                            data-test-id={`th-${header.key}`}
                                        >
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {r.map((row: any) => (
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
        expect(container.querySelector("table.eccgui-simpletable")).toBeTruthy();
        expect(container.querySelector("div.eccgui-simpletable__container")).toBeTruthy();
        // header renders a sort button
        const sortButton = container.querySelector("button.eccgui-simpletable__sort")!;
        expect(sortButton).toBeTruthy();
        expect(seen[seen.length - 1]).toEqual(["bravo", "alpha"]);
        // first click: ASC
        fireEvent.click(sortButton);
        expect(seen[seen.length - 1]).toEqual(["alpha", "bravo"]);
        expect(container.querySelector("th[aria-sort='ascending']")).toBeTruthy();
        // second click: DESC
        fireEvent.click(container.querySelector("button.eccgui-simpletable__sort")!);
        expect(seen[seen.length - 1]).toEqual(["bravo", "alpha"]);
        expect(container.querySelector("th[aria-sort='descending']")).toBeTruthy();
        // third click: NONE (original order)
        fireEvent.click(container.querySelector("button.eccgui-simpletable__sort")!);
        expect(seen[seen.length - 1]).toEqual(["bravo", "alpha"]);
        expect(container.querySelector("th[aria-sort='none']")).toBeTruthy();
    });

    it("renders expand rows with toggler and aria-expanded", () => {
        const onExpand = jest.fn();
        const { container } = render(
            <Table>
                <TableHead>
                    <TableRow>
                        <TableExpandHeader
                            enableToggle
                            isExpanded={false}
                            onExpand={onExpand}
                            togglerText="expand all"
                        />
                        <TableHeader>head</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableExpandRow isExpanded={true} onExpand={onExpand} togglerText="toggle row" useZebraStyle>
                        <TableCell>content</TableCell>
                    </TableExpandRow>
                    <TableExpandedRow colSpan={2} className="custom-expanded">
                        <div>expanded content</div>
                    </TableExpandedRow>
                </TableBody>
            </Table>,
        );
        const parentRow = container.querySelector("tr[data-parent-row]")!;
        expect(parentRow.className).toContain("eccgui-simpletable__row--expanded");
        expect(parentRow.className).toContain("eccgui-simpletable__row--zebra");
        const childRow = container.querySelector("tr[data-child-row]")!;
        expect(childRow.className).toContain("custom-expanded");
        expect(childRow.querySelector("td")!.getAttribute("colspan")).toBe("2");
        // toggler buttons carry aria-expanded and fire onExpand
        const rowToggler = parentRow.querySelector("td.eccgui-simpletable__rowexpander button")!;
        expect(rowToggler.getAttribute("aria-expanded")).toBe("true");
        fireEvent.click(rowToggler);
        expect(onExpand).toHaveBeenCalled();
        const headToggler = container.querySelector("th.eccgui-simpletable__headexpander button")!;
        expect(headToggler.getAttribute("aria-expanded")).toBe("false");
        // selected row class
        const { container: c2 } = render(
            <table>
                <tbody>
                    <TableRow isSelected data-test-id="sel-row">
                        <TableCell alignVertical="middle">x</TableCell>
                    </TableRow>
                </tbody>
            </table>,
        );
        const selRow = c2.querySelector("tr[data-test-id='sel-row']")!;
        expect(selRow.className).toContain("eccgui-simpletable__row--selected");
        expect(selRow.getAttribute("aria-selected")).toBe("true");
    });
});
