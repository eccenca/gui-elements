import React, { useState } from "react";
import _Pagination from "carbon-components-react/lib/components/Pagination";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

const CarbonPagination = _Pagination;

function Pagination({
    className,
    hidePageSizeConfiguration = false,
    hideInfoText = false,
    hidePageSelect = false,
    hideNavigationArrows = false,
    ...otherProps
}: any) {
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
    presentation?: {
        // For narrow space requirements, the info text in the middle can be hidden
        hideInfoText?: boolean;
    };
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
