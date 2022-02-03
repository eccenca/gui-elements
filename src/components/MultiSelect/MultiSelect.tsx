import React from "react";
import {
  MultiSelect as BlueprintMultiSelect,
  MultiSelectProps,
} from "@blueprintjs/select";
import MenuItem from "../Menu/MenuItem";
import Highlighter from "../Typography/Highlighter";
import Button from "../Button/Button";
import OverflowText from "../Typography/OverflowText";

interface SelectedParamsType<T> {
  newlySelected: T;
  selectedItems: T[];
  createdItems: Partial<T>[];
}

interface IProps<T> extends Pick<MultiSelectProps<T>, "fill" | "items"> {
  /**
   * field in an item, that differentiates on item from the other.
   */
  equalityProp: string;
  /**
   * field in the item object that would be used to describe the item.
   * this would be used in the item selection list as well as the multi-select input
   */
  labelProp: string;
  /**
   * if new items that are not in the original item list can be created and appended
   */
  canCreateNewItem?: boolean;
  /**
   * When set to true will set the multi-select value with all the items provided
   */
  prePopulateWithItems?: boolean;
  /**
   *  function handler that would be called anytime an item is selected/deselected or an item is created/removed
   */
  onSelection?: (params: SelectedParamsType<T>) => void;
  /**
   * Props to spread to `Popover`. Note that `content` cannot be changed.
   */
  popoverProps?: MultiSelectProps<T>["popoverProps"];
  /**
   * Props to spread to `TagInput`. Use `query` and `onQueryChange` to control the input.
   */
  tagInputProps?: MultiSelectProps<T>["tagInputProps"];
}

function MultiSelect<T>({
  items,
  prePopulateWithItems,
  equalityProp,
  labelProp,
  onSelection,
  canCreateNewItem,
  popoverProps,
  tagInputProps,
  ...otherProps
}: IProps<T>) {
  const [createdItems, setCreatedItems] = React.useState<T[]>([]);
  const [itemsCopy] = React.useState<T[]>([...items]);
  const [filteredItemList, setFilteredItemList] = React.useState<T[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<T[]>(() =>
    prePopulateWithItems ? [...items] : []
  );
  const [query, setQuery] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    onSelection &&
      onSelection({
        newlySelected: selectedItems.slice(-1)[0],
        createdItems,
        selectedItems,
      });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    onSelection,
    selectedItems.map((item) => item[equalityProp]).join("|"),
    createdItems.map((item) => item[equalityProp]).join("|"),
  ]);

  /**
   * using the equality prop specified checks if an item has already been selected
   * @param matcher
   * @returns
   */
  const itemHasBeenSelectedAlready = (matcher: string) => {
    return !!selectedItems.find((item) => item[equalityProp] === matcher);
  };

  /**
   * removes already selected item from the selectedItems
   * @param matcher
   */
  const removeItemSelection = (matcher: string) => {
    setSelectedItems((items) =>
      items.filter((t) => t[equalityProp] !== matcher)
    );
  };

  /**
   * selects and deselects an item from selection list
   * if the item exists it removes it instead
   * @param item
   */
  const onItemSelect = (item: T) => {
    if (itemHasBeenSelectedAlready(item[equalityProp])) {
      removeItemSelection(item[equalityProp]);
    } else {
      setSelectedItems((items) => [...items, item]);
    }
  };

  /**
   * search through item list using "label prop" and update the items popover
   * @param query
   */
  const onQueryChange = (query: string) => {
    setQuery(query);
    setFilteredItemList(() =>
      query.length
        ? itemsCopy.filter((t) => t[labelProp].includes(query))
        : itemsCopy
    );
  };

  // Renders the entries of the (search) options list
  const optionRenderer = (label: string) => {
    return <Highlighter label={label} searchValue={query} />;
  };

  /**
   * defines how an item in the item list is displayed
   * @param tag
   * @param param
   * @returns
   */
  const onItemRenderer = (tag: T, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        key={tag[equalityProp]}
        icon={
          itemHasBeenSelectedAlready(tag[equalityProp])
            ? "state-checked"
            : "state-unchecked"
        }
        onClick={handleClick}
        text={optionRenderer(tag[labelProp])}
        shouldDismissPopover={false}
      />
    );
  };

  /**
   * clear all selected items in the multi-select input
   */
  const handleClear = () => {
    setSelectedItems([]);
    setFilteredItemList(itemsCopy);
  };

  /**
   * remove a specific item from the multi-select input
   * @param label
   * @param index
   */
  const removeTagFromSelectionViaIndex = (label: string, index: number) => {
    setSelectedItems([
      ...selectedItems.slice(0, index),
      ...selectedItems.slice(index + 1),
    ]);
    setCreatedItems((items) => items.filter((t) => t[labelProp] !== label));
  };

  /**
   * utility function to create a new Item
   * @param event
   * @param label
   */
  const createNewItem = (event, label) => {
    const newItem = { [labelProp]: label } as any;
    //set new items
    setCreatedItems((items) => [...items, newItem]);
    setQuery("");
    itemsCopy.push(newItem);
  };

  /**
   * added functionality to create new item when there are no matching items on enter keypress
   * @param event
   */
  const handleOnKeyUp = (event) => {
    if (event.key === "Enter" && !filteredItemList.length) {
      createNewItem(event, query);
    }
  };

  /**
   * create new item handler, displays the new item selector and creates a new item when selected
   * @param label '
   * @param active
   * @param handleClick
   * @returns
   */
  const newItemRenderer = (label: string, active: boolean, handleClick) => {
    if (!canCreateNewItem) return undefined;
    const clickHandler = (e) => {
      createNewItem(e, label);
      handleClick(e);
    };
    return (
      <MenuItem
        id={"new-tag"}
        icon="item-add-artefact"
        active={active}
        key={label}
        onClick={clickHandler}
        text={<OverflowText>{`Add new tag '${label}'`}</OverflowText>}
      />
    );
  };

  const clearButton =
    selectedItems.length > 0 ? (
      <Button
        icon="operation-clear"
        data-test-id="clear-all-items"
        minimal={true}
        onClick={handleClear}
      />
    ) : undefined;

  return (
    <BlueprintMultiSelect
      {...otherProps}
      query={query}
      onQueryChange={onQueryChange}
      items={filteredItemList}
      onItemSelect={onItemSelect}
      itemRenderer={onItemRenderer}
      itemsEqual={(a, b) => a[labelProp] === b[labelProp]}
      selectedItems={selectedItems}
      noResults={<MenuItem disabled={true} text="No results." />}
      tagRenderer={(tag) => tag[labelProp]}
      openOnKeyDown={true}
      createNewItemRenderer={newItemRenderer}
      createNewItemFromQuery={(query) =>
        ({
          [labelProp]: query,
        } as any)
      }
      tagInputProps={{
        inputProps: {
          id: "item",
          autoComplete: "off",
        },
        onKeyUp: handleOnKeyUp,
        onRemove: removeTagFromSelectionViaIndex,
        rightElement: clearButton,
        tagProps: { minimal: true },
        ...tagInputProps,
      }}
      popoverProps={{
        minimal: true,
        fill: true,
        position: "bottom-left",
        ...popoverProps,
      }}
    />
  );
}

export default MultiSelect;
