import React, { useState } from "react";

import { cn } from "../../common/utils/cn";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { IconButton } from "../Icon/IconButton";

/**
 * A single page-size option. Either a plain number (rendered and used as-is) or an
 * object with a separate display `text` and numeric `value` (mirrors the shape the
 * former `@carbon/react` Pagination accepted).
 */
export type PaginationPageSize = number | { text: string | number; value: number };

interface NormalizedPageSize {
    text: string;
    value: number;
}

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    /**
     * Additional class names.
     */
    className?: string;
    /**
     * The current page (1-based).
     */
    page?: number;
    /**
     * The number of items displayed per page.
     */
    pageSize?: number;
    /**
     * The available page sizes to choose from.
     */
    pageSizes?: PaginationPageSize[];
    /**
     * The total number of items that can be paged through.
     */
    totalItems?: number;
    /**
     * Called whenever the page or the page size changes. Receives the same
     * `{ page, pageSize }` payload shape as the former `@carbon/react` Pagination.
     */
    onChange?: (data: { page: number; pageSize: number }) => void;
    /**
     * Accessible/tooltip text of the button to navigate to the previous page.
     */
    backwardText?: string;
    /**
     * Accessible/tooltip text of the button to navigate to the next page.
     */
    forwardText?: string;
    /**
     * Label of the page size selector.
     */
    itemsPerPageText?: string;
    /**
     * Text describing the currently displayed items when the total is unknown.
     */
    itemText?: (min: number, max: number) => string;
    /**
     * Text describing the currently displayed items in relation to the total.
     */
    itemRangeText?: (min: number, max: number, total: number) => string;
    /**
     * Text describing the current page in relation to the total number of pages.
     */
    pageRangeText?: (current: number, total: number) => string;
    /**
     * Text describing the current page when the total is unknown.
     */
    pageText?: (page: number) => string;
    /**
     * Accessible label of the page selector.
     */
    pageSelectLabelText?: (total: number) => string;
    /**
     * The total number of pages is unknown. Hides the page selector and the page range text.
     */
    pagesUnknown?: boolean;
    /**
     * The currently displayed page is the last one (disables the "next" navigation).
     */
    isLastPage?: boolean;
    /**
     * Disable the whole element.
     */
    disabled?: boolean;
    /**
     * Disable the page selector only.
     */
    pageInputDisabled?: boolean;
    /**
     * Disable the page size selector only.
     */
    pageSizeInputDisabled?: boolean;
    /**
     * Size variant of the element.
     */
    size?: "sm" | "md" | "lg";
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

/**
 * Shared styling for the two native `<select>` elements. Reuses the input recipe
 * tokens (`border-input`, `ring-ring`, …) from the vendored shadcn `input`, so the
 * page-size and page selector look consistent with the rest of the form primitives
 * without pulling in the heavier combobox.
 */
const paginationSelectClassName =
    "h-8 cursor-pointer rounded-md border border-input bg-transparent px-2 text-sm text-foreground outline-none " +
    "transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const normalizePageSizes = (sizes: PaginationPageSize[]): NormalizedPageSize[] =>
    sizes.map((size) =>
        typeof size === "object" && size !== null
            ? { text: String(size.text), value: size.value }
            : { text: String(size), value: size },
    );

/**
 * Resolves the effective page size: the passed `pageSize` if it is one of the
 * available `pageSizes`, otherwise the first available page size (mirrors the
 * `getPageSize` fallback of the former `@carbon/react` Pagination).
 */
const resolvePageSize = (sizes: NormalizedPageSize[], pageSize?: number): number => {
    if (typeof pageSize !== "undefined" && sizes.some((size) => size.value === pageSize)) {
        return pageSize;
    }
    return sizes[0]?.value ?? pageSize ?? 0;
};

export const Pagination = ({
    className,
    page: controlledPage = 1,
    pageSize: controlledPageSize,
    pageSizes: controlledPageSizes = [10],
    totalItems = 0,
    onChange,
    backwardText = "Previous page",
    forwardText = "Next page",
    itemsPerPageText = "Rows per page",
    itemText = (min, max) => `${min}–${max}`,
    itemRangeText = (min, max, total) => `${min}–${max} of ${total}`,
    pageRangeText = (_current, total) => `of ${total}`,
    pageText = (page) => `page ${page}`,
    pageSelectLabelText = (total) => `Page of ${total} ${total === 1 ? "page" : "pages"}`,
    pagesUnknown = false,
    isLastPage = false,
    disabled = false,
    pageInputDisabled = false,
    pageSizeInputDisabled = false,
    size = "md",
    hidePageSizeConfiguration = false,
    hideInfoText = false,
    hidePageSelect = false,
    hideNavigationArrows = false,
    hideBorders = false,
    ...otherProps
}: PaginationProps) => {
    const inputId = React.useId();
    const normalizedPageSizes = React.useMemo(
        () => normalizePageSizes(controlledPageSizes),
        [controlledPageSizes],
    );

    // The element keeps its own page/page-size state (so it stays interactive even
    // when used uncontrolled) but stays in sync with the controlled props, matching
    // the hybrid controlled behaviour of the former `@carbon/react` Pagination.
    const [page, setPage] = useState<number>(controlledPage);
    const [pageSize, setPageSize] = useState<number>(() => resolvePageSize(normalizedPageSizes, controlledPageSize));

    React.useEffect(() => {
        setPage(controlledPage);
    }, [controlledPage]);

    const prevControlledPageSize = React.useRef(controlledPageSize);
    React.useEffect(() => {
        if (controlledPageSize === prevControlledPageSize.current) return;
        prevControlledPageSize.current = controlledPageSize;
        setPageSize(resolvePageSize(normalizedPageSizes, controlledPageSize));
    }, [controlledPageSize, normalizedPageSizes]);

    const totalPages = totalItems ? Math.max(Math.ceil(totalItems / pageSize), 1) : 1;
    const backButtonDisabled = disabled || page <= 1;
    const forwardButtonDisabled = disabled || isLastPage || (page >= totalPages && !pagesUnknown);

    const emitChange = (nextPage: number, nextPageSize: number) => {
        onChange?.({ page: nextPage, pageSize: nextPageSize });
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextPageSize = Number(event.target.value);
        setPage(1);
        setPageSize(nextPageSize);
        emitChange(1, nextPageSize);
    };

    const handlePageSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextPage = Number(event.target.value);
        if (nextPage > 0 && totalItems && nextPage <= totalPages) {
            setPage(nextPage);
            emitChange(nextPage, pageSize);
        }
    };

    const decrementPage = () => {
        const nextPage = page - 1;
        setPage(nextPage);
        emitChange(nextPage, pageSize);
    };

    const incrementPage = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        emitChange(nextPage, pageSize);
    };

    const itemsCountText =
        pagesUnknown || !totalItems
            ? totalItems === 0
                ? itemRangeText(0, 0, 0)
                : itemText(pageSize * (page - 1) + 1, page * pageSize)
            : itemRangeText(
                  Math.min(pageSize * (page - 1) + 1, totalItems),
                  Math.min(page * pageSize, totalItems),
                  totalItems,
              );

    const pageSelectItems: number[] = [];
    for (let counter = 1; counter <= totalPages; counter++) {
        pageSelectItems.push(counter);
    }

    return (
        <div
            {...otherProps}
            className={
                cn(
                    "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-2 py-2 text-sm text-muted-foreground",
                    hideBorders ? undefined : "border-t border-border",
                    `${eccgui}-pagination`,
                    `${eccgui}-pagination--${size}`,
                    className,
                    hidePageSizeConfiguration ? `${eccgui}-pagination--hidepagesize` : undefined,
                    hideInfoText ? `${eccgui}-pagination--hideinfotext` : undefined,
                    hidePageSelect ? `${eccgui}-pagination--hidepageselect` : undefined,
                    hideNavigationArrows ? `${eccgui}-pagination--hidenavigation` : undefined,
                    hideBorders ? `${eccgui}-pagination--hideborders` : undefined,
                ) || undefined
            }
        >
            <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", `${eccgui}-pagination__left`)}>
                {!hidePageSizeConfiguration && (
                    <>
                        <label htmlFor={`${inputId}-count`} className={cn("text-muted-foreground", `${eccgui}-pagination__text`)}>
                            {itemsPerPageText}
                        </label>
                        <select
                            id={`${inputId}-count`}
                            className={cn(paginationSelectClassName, `${eccgui}-pagination__pagesize`)}
                            value={String(pageSize)}
                            onChange={handlePageSizeChange}
                            disabled={pageSizeInputDisabled || disabled}
                        >
                            {normalizedPageSizes.map((sizeObj) => (
                                <option key={sizeObj.value} value={String(sizeObj.value)}>
                                    {sizeObj.text}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>
            <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", `${eccgui}-pagination__right`)}>
                {!hideInfoText && (
                    <span className={cn("text-muted-foreground", `${eccgui}-pagination__text`, `${eccgui}-pagination__items-count`)}>
                        {itemsCountText}
                    </span>
                )}
                {!hidePageSelect &&
                    (pagesUnknown ? (
                        <span className={cn("text-muted-foreground", `${eccgui}-pagination__text`)}>{pageText(page)}</span>
                    ) : (
                        <>
                            <select
                                aria-label={pageSelectLabelText(totalPages)}
                                className={cn(paginationSelectClassName, `${eccgui}-pagination__pageselect`)}
                                value={String(page)}
                                onChange={handlePageSelectChange}
                                disabled={pageInputDisabled || disabled}
                            >
                                {pageSelectItems.map((pageNumber) => (
                                    <option key={pageNumber} value={String(pageNumber)}>
                                        {pageNumber}
                                    </option>
                                ))}
                            </select>
                            <span className={cn("text-muted-foreground", `${eccgui}-pagination__text`)}>
                                {pageRangeText(page, totalPages)}
                            </span>
                        </>
                    ))}
                {!hideNavigationArrows && (
                    <div className={cn("flex items-center gap-1", `${eccgui}-pagination__control-buttons`)}>
                        <IconButton
                            name="navigation-previous"
                            text={backwardText}
                            tooltipAsTitle
                            size="small"
                            onClick={decrementPage}
                            disabled={backButtonDisabled}
                        />
                        <IconButton
                            name="navigation-next"
                            text={forwardText}
                            tooltipAsTitle
                            size="small"
                            onClick={incrementPage}
                            disabled={forwardButtonDisabled}
                        />
                    </div>
                )}
            </div>
        </div>
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
        [setPagination],
    );
    // When the total number of pageable items changes, this function must be called
    const onTotalChange = React.useCallback(
        (total: number): void => {
            if (_pagination.current.total !== total) {
                setPagination({ ..._pagination.current, total: total, current: 1 });
            }
        },
        [setPagination],
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
