import Button from "../Button/Button";
import React, {useEffect} from "react";

export interface ListProps<T>{
    items: T[]
    /** Renders the item. */
    itemRenderer: (item: T) => React.ReactNode
    /** The ID/key of an item. */
    itemId: (item: T) => string
    /** Limit the numbers of shown (and rendered) components. */
    limitOptions?: {
        initialMax: number
        stepSize: number
    }
    moreLabel?: string
}

/** A generic list component with support of various performance/scalability improvements. */
export function List<T>({
    items,
    itemRenderer,
    itemId,
    limitOptions,
    moreLabel = "Show more..."
}: ListProps<T>) {
    // The number of items to show in the list, undefined means unlimited
    const [nrOfItemsToShow, setNrOfItemsToShow] = React.useState<number | undefined>(limitOptions?.initialMax ?? undefined)

    useEffect(() => {
        setNrOfItemsToShow(limitOptions?.initialMax ?? undefined)
    }, [items.length, limitOptions?.initialMax])

    const onShowMore = () => {
        if(limitOptions) {
            setNrOfItemsToShow(current => (current ?? 0)  + limitOptions.stepSize)
        }
    }

    return <ol>
        {
            (nrOfItemsToShow ? items.slice(0, nrOfItemsToShow) : items)
                .map(item => {
                    return <li key={itemId(item)}>
                        {itemRenderer(item)}
                    </li>
                })
        }
        {nrOfItemsToShow != null && nrOfItemsToShow < items.length && <Button onClick={onShowMore} fill={true}>{moreLabel}</Button>}
    </ol>
}

export default List
