import React, { useState } from "react";
import { Pagination as CarbonPagination } from "@carbon/react";
import { PaginationProps as CarbonPaginationProps } from "@carbon/react/es/components/Pagination/Pagination";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface PaginationProps extends CarbonPaginationProps {
    /**
     * Additional class names.
     */
    className?: string;
    /**
     * Hide dropdown to select how many items will be shown per page.
     */
    hidePageSizeConfiguration?: boolean;
    /**
     * Hide info block about the section of the displayed items.
     */
    hideInfoText?: boolean;
    /**
     * Hide dropdown to select page number directly.
     */
    hidePageSelect?: boolean;
    /**
     * Hide prev/next arrows to navigate through the pages.
     */
    hideNavigationArrows?: boolean;
    /**
     * Element is displayed with dividing borders.
     */
    hideBorders?: boolean;
}

export const Pagination = ({
    className,
    hidePageSizeConfiguration = false,
    hideInfoText = false,
    hidePageSelect = false,
    hideNavigationArrows = false,
    hideBorders = false,
    ...otherProps
}: PaginationProps) => {
    return (
        <CarbonPagination
            {...otherProps}
            className={
                `${eccgui}-pagination` +
                (className ? " " + className : "") +
                (hidePageSizeConfiguration ? ` ${eccgui}-pagination--hidepagesize` : "") +
                (hideInfoText ? ` ${eccgui}-pagination--hideinfotext` : "") +
                (hidePageSelect ? ` ${eccgui}-pagination--hidepageselect` : "") +
                (hideNavigationArrows ? ` ${eccgui}-pagination--hidenavigation` : "") +
                (hideBorders ? ` ${eccgui}-pagination--hideborders` : "")
            }
        />
    );
};

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
    const _pagination = React.useRef<IPaginationDetails>({
        total: 0,
        current: 1,
        limit: initialPageSize ? initialPageSize : minSize,
        minPageSize: minSize,
    });
    const [pagination, _setPagination] = useState<IPaginationDetails>(_pagination.current);
    const setPagination = React.useCallback((newPagination: IPaginationDetails) => {
        // Check if pagination has actually changed
        const current = _pagination.current;
        if (
            newPagination.current !== current.current ||
            newPagination.minPageSize !== current.minPageSize ||
            newPagination.limit !== current.limit ||
            newPagination.total !== current.total
        ) {
            _pagination.current = newPagination;
            _setPagination(newPagination);
        }
    }, []);
    const onPaginationChange = React.useCallback(
        ({ page, pageSize }: { page: any; pageSize: any }) => {
            setPagination({ ..._pagination.current, current: page, limit: pageSize });
        },
        [setPagination]
    );
    // When the total number of pageable items changes, this function must be called
    const onTotalChange = React.useCallback(
        (total: number): void => {
            if (_pagination.current.total !== total) {
                setPagination({ ..._pagination.current, total: total, current: 1 });
            }
        },
        [setPagination]
    );
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
