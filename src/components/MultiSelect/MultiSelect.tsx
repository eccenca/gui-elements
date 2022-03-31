import React from "react";
import { Intent as BlueprintIntent } from "@blueprintjs/core";
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

interface IProps<T> extends Pick<MultiSelectProps<T>, "items" | "placeholder"> {
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

  /**
   * prop to listen for query changes, when text is entered in the multi-select input
   */
  runOnQueryChange?:(query: string) => void;
 /**
   * Whether the component should take up the full width of its container.
   * This overrides `popoverProps.fill` and `tagInputProps.fill`.
  */
  fullWidth?: boolean;
 /**
   * text content to render when filtering items returns zero results.
   * If omitted, "No results." will be rendered in this case.
   */
  noResultText?: string;
   /**
   * text content to render when a new item non-existing in filtered items is about to be created .
   * If omitted, "No results." will be rendered in this case.
   */
  newItemCreationText?: string;
  /**
  * The input element is displayed with primary color scheme.
  */
  hasStatePrimary?: boolean;
  /**
  * The input element is displayed with success (some type of green) color scheme.
  */
  hasStateSuccess?: boolean;
  /**
  * The input element is displayed with success (some type of orange) color scheme.
  */
  hasStateWarning?: boolean;
  /**
  * The input element is displayed with success (some type of red) color scheme.
  */
  hasStateDanger?: boolean;
  /**
  * Disables the input element
  */
  disabled?: boolean;
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
  runOnQueryChange,
  fullWidth = true,
  noResultText="No results.",
  newItemCreationText = "Add new tag",
  hasStatePrimary,
  hasStateDanger,
  hasStateSuccess,
  hasStateWarning,
  disabled,
  ...otherProps
}: IProps<T>) {
  const [createdItems, setCreatedItems] = React.useState<T[]>([]);
  const [itemsCopy, setItemsCopy] = React.useState<T[]>([...items]);
  const [filteredItemList, setFilteredItemList] = React.useState<T[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<T[]>(() =>
    prePopulateWithItems ? [...items] : []
  );
  const [query, setQuery] = React.useState<string | undefined>(undefined);
  //currently focused element in popover list
  const [focusedItem, setFocusedItem] = React.useState<T | null>(null);

  let intent;
  switch (true) {
      case hasStatePrimary:
          intent = BlueprintIntent.PRIMARY;
          break;
      case hasStateSuccess:
          intent = BlueprintIntent.SUCCESS;
          break;
      case hasStateWarning:
          intent = BlueprintIntent.WARNING;
          break;
      case hasStateDanger:
          intent = BlueprintIntent.DANGER;
          break;
      default:
          break;
  }

  /** update items copy when the items change
   *  e.g for auto-complete when query change
   */
  React.useEffect(() => {
    setItemsCopy([...items, ...createdItems]);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [items.map((t) => t[equalityProp]).join("|")]);


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
      setQuery("");
  };

  /**
   * search through item list using "label prop" and update the items popover
   * @param query
   */
  const onQueryChange = (query: string) => {
    setQuery(query);
   runOnQueryChange && runOnQueryChange(removeExtraSpaces(query));
    setFilteredItemList(() =>
      query.length
        ? itemsCopy.filter((t) => t[labelProp].toLowerCase().includes(query.toLowerCase()))
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
  const onItemRenderer = (item: T, { handleClick, modifiers }) => {
      if (!modifiers.matchesPredicate) {
          return null;
      }
      const label = createdItems.find((createdItem) => createdItem[labelProp] === item[labelProp])
          ? `${item[labelProp]} (new tag)`
          : item[labelProp];
      return (
          <MenuItem
              active={modifiers.active}
              key={item[equalityProp]}
              icon={itemHasBeenSelectedAlready(item[equalityProp]) ? "state-checked" : "state-unchecked"}
              onClick={handleClick}
              text={optionRenderer(label)}
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

  const removeExtraSpaces = (text:string) => text.replace(/\s+/g, " ").trim();

  /**
   * utility function to create a new Item
   * @param event
   * @param label
   */
  const createNewItem = (event, label) => {
    const newItem = { [labelProp]: removeExtraSpaces(label), [equalityProp]: removeExtraSpaces(label) } as any;
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
        text={<OverflowText>{`${newItemCreationText} '${label}'`}</OverflowText>}
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
      noResults={<MenuItem disabled={true} text={noResultText} />}
      tagRenderer={(tag) => tag[labelProp]}
      openOnKeyDown={true}
      createNewItemRenderer={newItemRenderer}
      onActiveItemChange={(activeItem) => setFocusedItem(activeItem)}
      fill={fullWidth}
      createNewItemFromQuery={(query) =>
        ({
          [labelProp]: removeExtraSpaces(query),
          [equalityProp]: removeExtraSpaces(query),
        } as any)
      }
      tagInputProps={{
        inputProps: {
          id: "item",
          autoComplete: "off",
        },
        intent,
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          if(event.key === "Tab" && focusedItem && query?.length){
            event.preventDefault();
            onItemSelect(focusedItem);
          }
        },
        onKeyUp: handleOnKeyUp,
        onRemove: removeTagFromSelectionViaIndex,
        rightElement: disabled ? undefined : clearButton,
        tagProps: { minimal: true },
        disabled,
        ...tagInputProps,
      }}
      popoverProps={{
        minimal: true,
        position: "bottom-left",
        hasBackdrop: true, 
        ...popoverProps,
      }}
    />
  );
}

export default MultiSelect;
