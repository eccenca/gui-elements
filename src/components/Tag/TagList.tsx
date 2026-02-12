import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Tag from "./Tag";
import Tooltip from "../Tooltip/Tooltip";

export interface TagListProps extends React.HTMLAttributes<HTMLUListElement> {
    label?: string;
}

function TagList({ children, className = "", label = "", ...otherProps }: TagListProps) {
    const containerRef = React.useRef<HTMLUListElement>(null);
    const measurementRef = React.useRef<HTMLUListElement>(null);
    const moreTagRef = React.useRef<HTMLLIElement>(null);
    const [visibleCount, setVisibleCount] = React.useState<number | null>(null);

    const childArray = React.Children.toArray(children).filter(Boolean);

    React.useEffect(() => {
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
                // Only show overflow if we have at least 1 visible tag
                if (adjustedCount > 0) {
                    setVisibleCount(adjustedCount);
                } else {
                    // If no tags fit with the "+X more" tag, show all tags instead
                    setVisibleCount(null);
                }
            } else {
                // All items fit
                setVisibleCount(null);
            }
        };

        // Use RAF to ensure DOM is ready
        requestAnimationFrame(() => {
            checkOverflow();
        });

        // Watch for size changes
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(checkOverflow);
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [childArray.length]);

    const showOverflowTag = visibleCount !== null && visibleCount < childArray.length;
    const visibleChildren = showOverflowTag ? childArray.slice(0, visibleCount) : childArray;
    const hiddenCount = childArray.length - (visibleCount ?? childArray.length);

    const tagList = (
        <ul
            className={`${eccgui}-tag__list` + (className && !label ? " " + className : "")}
            {...otherProps}
            style={{ ...otherProps.style, display: 'flex', flexWrap: 'nowrap', overflow: 'hidden' }}
            ref={containerRef}
        >
            {visibleChildren.map((child, i) => (
                <li className={`${eccgui}-tag__list-item`} key={"tagitem_" + i}>
                    {child}
                </li>
            ))}
            {showOverflowTag && (
                <li className={`${eccgui}-tag__list-item`} key="overflow-tag">
                    <Tooltip
                        content={
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '400px' }}>
                                {childArray.map((child, i) => (
                                    <React.Fragment key={"tooltip-tag-" + i}>{child}</React.Fragment>
                                ))}
                            </div>
                        }
                        size="large"
                    >
                        <Tag small>+{hiddenCount} more</Tag>
                    </Tooltip>
                </li>
            )}
        </ul>
    );

    // Hidden measurement list - always rendered for measurements
    const measurementList = (
        <ul
            style={{
                position: 'absolute',
                visibility: 'hidden',
                display: 'flex',
                flexWrap: 'nowrap',
                pointerEvents: 'none',
                width: containerRef.current?.clientWidth ?? '100%',
            }}
            aria-hidden="true"
            ref={measurementRef}
        >
            {childArray.map((child, i) => (
                <li className={`${eccgui}-tag__list-item`} key={"measure_" + i}>
                    {child}
                </li>
            ))}
            <li
                className={`${eccgui}-tag__list-item`}
                key="measure-more-tag"
                ref={moreTagRef}
                data-more-tag="true"
            >
                <Tag small>+{childArray.length} more</Tag>
            </li>
        </ul>
    );

    if (label) {
        return (
            <div className={`${eccgui}-tag__list-wrapper` + (className ? " " + className : "")}>
                <strong className={`${eccgui}-tag__list-label`}>{label}</strong>
                <span className={`${eccgui}-tag__list-content`} style={{ position: 'relative' }}>
                    {tagList}
                    {measurementList}
                </span>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {tagList}
            {measurementList}
        </div>
    );
}

export default TagList;
