import React, { useState } from "react";
import {Pagination as CarbonPagination, PaginationProps as CarbonPaginationProps} from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

interface PaginationProps extends CarbonPaginationProps {
    /**
     Hide the select option to set how many items per page are displayed.
     */
    hidePageSizeConfiguration?: boolean;
    /**
     Hide info about the item numbers that are currently displayed.
     */
    hideInfoText?: boolean;
    /**
     Hide select box to switch between pages.
     */
    hidePageSelect?: boolean;
    /**
     Hide buttons to switch beteen nex/prev pages.
     */
    hideNavigationArrows?: boolean;
}

function Pagination({
    className,
    hidePageSizeConfiguration = false,
    hideInfoText = false,
    hidePageSelect = false,
    hideNavigationArrows = false,
    ...otherProps
}: PaginationProps) {
    return (
        <CarbonPagination
            {...otherProps}
            className={
                `${eccgui}-pagination` +
                (className ? " " + className : "") +
                (hidePageSizeConfiguration ? ` ${eccgui}-pagination--hidepagesize` : "") +
                (hideInfoText ? ` ${eccgui}-pagination--hideinfotext` : "") +
                (hidePageSelect ? ` ${eccgui}-pagination--hidepageselect` : "") +
                (hideNavigationArrows ? ` ${eccgui}-pagination--hidenavigation` : "")
            }
        />
    );
}

interface IPaginationDetails {
    total: number;
    current: number;
    limit: number;
    minPageSize: number;
}

interface IPaginationOptions {
    // The initial page size
    initialPageSize?: number;
    // The option of page sizes
    pageSizes?: number[];
    // Presentation options
    presentation?: Omit<PaginationProps, "onChange" | "totalItems" | "pageSizes" | "page" | "pageSize">;
}

// Custom hook to add pagination. Currently only use-cases are supported where paging has no further side effects, e.g. REST calls.
export const usePagination = ({
    pageSizes = [5, 10, 25, 50],
    presentation = {},
    initialPageSize,
}: IPaginationOptions) => {
    const minSize = Math.min(...pageSizes);
    const [pagination, setPagination] = useState<IPaginationDetails>({
        total: 0,
        current: 1,
        limit: initialPageSize ? initialPageSize : minSize,
        minPageSize: minSize,
    });
    const onPaginationChange = ({ page, pageSize }: {page: any, pageSize: any}) => {
        setPagination({ ...pagination, current: page, limit: pageSize });
    };
    // When the total number of pageable items changes, this function must be called
    const onTotalChange = (total: number): void => {
        setPagination({ ...pagination, total: total, current: 1 });
    };
    const paginationElement = (
        <Pagination
            onChange={onPaginationChange}
            totalItems={pagination.total}
            pageSizes={pageSizes}
            page={pagination.current}
            pageSize={pagination.limit}
            {...presentation}
        />
    );
    return [pagination, paginationElement, onTotalChange] as const;
};

export default Pagination;
