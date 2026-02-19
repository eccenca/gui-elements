import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Tooltip from "../Tooltip/Tooltip";

import Tag from "./Tag";

export interface TagListProps extends React.HTMLAttributes<HTMLUListElement> {
    label?: string;
}

function TagList({ children, className = "", label = "", ...otherProps }: TagListProps) {
    const containerRef = React.useRef<HTMLUListElement>(null);
    const measurementRef = React.useRef<HTMLUListElement>(null);
    const moreTagRef = React.useRef<HTMLLIElement>(null);
    const [visibleCount, setVisibleCount] = React.useState<number | null>(null);

    const childArray = React.useMemo(() => React.Children.toArray(children).filter(Boolean), [children]);

    React.useEffect(() => {
        let rafId: number | null = null;

        const checkOverflow = () => {
            if (!containerRef.current || !measurementRef.current || !moreTagRef.current || childArray.length === 0) {
                return;
            }

            const container = containerRef.current;
            const measurement = measurementRef.current;
            const containerWidth = container.clientWidth;

            // If no size constraints, show all tags
            if (containerWidth === 0) {
                setVisibleCount(null);
                return;
            }

            const items = Array.from(measurement.children).filter(
                (child) => !(child as HTMLElement).dataset.moreTag
            ) as HTMLLIElement[];

            if (items.length === 0) {
                setVisibleCount(null);
                return;
            }

            // Get the actual width of the "+X more" tag
            const moreTagWidth = moreTagRef.current.offsetWidth;

            let totalWidth = 0;
            let count = 0;

            // Calculate how many items fit in one row
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const itemWidth = item.offsetWidth;

                if (totalWidth + itemWidth <= containerWidth) {
                    totalWidth += itemWidth;
                    count++;
                } else {
                    // This item doesn't fit
                    break;
                }
            }

            // If not all items fit, adjust count to leave room for "+X more" tag
            if (count < childArray.length) {
                let adjustedWidth = 0;
                let adjustedCount = 0;

                for (let i = 0; i < count; i++) {
                    const item = items[i];
                    const itemWidth = item.offsetWidth;

                    if (adjustedWidth + itemWidth + moreTagWidth <= containerWidth) {
                        adjustedWidth += itemWidth;
                        adjustedCount++;
                    } else {
                        break;
                    }
                }

                // Ensure at least one tag is visible before the "+X more" tag
                if (adjustedCount > 0) {
                    setVisibleCount(adjustedCount);
                } else {
                    // No tags fit alongside the "+X more" tag (e.g. first tag is very wide).
                    // Force 1 visible tag so the overflow indicator is still shown;
                    // CSS (min-width: 0 + overflow: hidden on the li) handles clipping.
                    setVisibleCount(1);
                }
            } else {
                // All items fit
                setVisibleCount(null);
            }
        };

        // Use RAF to ensure DOM is ready
        rafId = requestAnimationFrame(() => {
            checkOverflow();
        });

        // Watch for size changes
        const resizeObserver = new ResizeObserver(() => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(checkOverflow);
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            resizeObserver.disconnect();
        };
    }, [childArray]);

    const showOverflowTag = visibleCount !== null && visibleCount < childArray.length;
    const visibleChildren = showOverflowTag ? childArray.slice(0, visibleCount) : childArray;
    const hiddenCount = childArray.length - (visibleCount ?? childArray.length);

    const tagList = (
        <ul
            className={`${eccgui}-tag__list` + (className && !label ? " " + className : "")}
            {...otherProps}
            role="list"
            aria-label={label || "Tag list"}
            ref={containerRef}
        >
            {visibleChildren.map((child, i) => (
                <li
                    className={
                        `${eccgui}-tag__list-item` + (showOverflowTag ? ` ${eccgui}-tag__list-item--overflow` : "")
                    }
                    role="listitem"
                    key={"tagitem_" + i}
                >
                    {child}
                </li>
            ))}
            {showOverflowTag && (
                <li
                    className={`${eccgui}-tag__list-item ${eccgui}-tag__list-item--more`}
                    role="listitem"
                    key="overflow-tag"
                >
                    <Tooltip
                        content={
                            <div className={`${eccgui}-tag__list-overflow-content`}>
                                {childArray.map((child, i) => (
                                    <React.Fragment key={"tooltip-tag-" + i}>{child}</React.Fragment>
                                ))}
                            </div>
                        }
                        size="large"
                    >
                        <Tag
                            small
                            aria-label={`${hiddenCount} more ${
                                hiddenCount === 1 ? "tag" : "tags"
                            } hidden. Hover to see all ${childArray.length} tags.`}
                        >
                            +{hiddenCount} more
                        </Tag>
                    </Tooltip>
                </li>
            )}
        </ul>
    );

    // Hidden measurement list - always rendered for measurements
    const measurementList = (
        <ul
            className={`${eccgui}-tag__list--measure`}
            style={{ width: containerRef.current?.clientWidth ?? "100%" }}
            aria-hidden="true"
            ref={measurementRef}
        >
            {childArray.map((child, i) => (
                <li className={`${eccgui}-tag__list-item`} key={"measure_" + i}>
                    {child}
                </li>
            ))}
            <li className={`${eccgui}-tag__list-item`} key="measure-more-tag" ref={moreTagRef} data-more-tag="true">
                <Tag small>+{childArray.length} more</Tag>
            </li>
        </ul>
    );

    if (label) {
        return (
            <div className={`${eccgui}-tag__list-wrapper` + (className ? " " + className : "")}>
                <strong className={`${eccgui}-tag__list-label`}>{label}</strong>
                <span className={`${eccgui}-tag__list-content`}>
                    {tagList}
                    {measurementList}
                </span>
            </div>
        );
    }

    return (
        <div className={`${eccgui}-tag__list-container` + (className ? " " + className : "")}>
            {tagList}
            {measurementList}
        </div>
    );
}

export default TagList;
