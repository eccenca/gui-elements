import React from "react";
import { loremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "storybook/test";

import { helpersArgTypes } from "../../../.storybook/helpers";
import { Button, Depiction, FieldItem, MenuItem, Select, Tag } from "../../index";
import { FullExample as DepictionExample } from "../Depiction/stories/Depiction.stories";

export default {
    title: "Forms/Select",
    component: Select,
    argTypes: {
        icon: {
            ...helpersArgTypes.exampleIcon,
        },
        rightIcon: {
            ...helpersArgTypes.exampleIcon,
        },
    },
} as Meta<typeof Select>;

const Template: StoryFn<typeof Select> = (args) => (
    <FieldItem labelProps={{ text: "Select example", hidden: true }}>
        <Select {...args} />
    </FieldItem>
);

export const Default = Template.bind({});
Default.args = {
    items: loremIpsum({ p: 1, avgSentencesPerParagraph: 5, random: false })
        .toString()
        .split(".")
        .filter((item) => item.trim().length > 0)
        .map((item) => {
            return { label: item };
        }),
    itemRenderer: (item, { handleClick, handleFocus, id, modifiers }) => (
        <MenuItem
            key={item.label}
            id={id}
            text={item.label}
            title={item.label}
            onClick={handleClick}
            onFocus={handleFocus}
            active={modifiers.active}
            aria-selected={modifiers.active}
            roleStructure="listoption"
            tabIndex={-1}
        />
    ),
    fill: true,
};

/**
 * Using a `Depiction` element instead of a simple `icon` name
 */
export const UsingDepictionAsIcon = Template.bind({});
UsingDepictionAsIcon.args = {
    ...Default.args,
    icon: <Depiction {...DepictionExample.args} size="tiny" resizing="cover" ratio="1:1" />,
};

/**
 * A controlled select target is used by adding `children` elements to `<Select />` directly.
 * Properties like `text`, `placeholder`, `onClearanceHandler` and `onClearanceText` won't be evaluated then.
 *
 * If a `button` or an `output` element is used as controlled target, then it should refer to itself via `aria-labelledby`.
 * Otherwise a connected label, e.g. by `<FieldItem />`, replaces its content as accessible name,
 * and screen readers would not announce the selected value anymore.
 * `<FieldItem />` puts its label ID in front of the self-reference, so label and selected value are both announced.
 * This only works if `preventAriaAttribution` of `<FieldItem />` is not `true`.
 * Otherwise the connection between label and button needs to be managed manually according to the WAI-ARIA specifications anyway.
 *
 * ```tsx
 * <FieldItem labelProps={{ text: "Label" }}>
 *     <Select {...otherSelectProps}>
 *         <Button id="selecttarget" aria-labelledby="selecttarget" text={selectedValue} />
 *     </Select>
 * </FieldItem>
 * ```
 */
export const ControlledTarget = Template.bind({});
ControlledTarget.args = {
    ...Default.args,
    fill: false,
    children: (
        <Button
            id="controlledselecttarget"
            aria-labelledby="controlledselecttarget"
            text="Controlled select target"
            elevated
        />
    ),
    onActiveItemChange: fn(),
};

/**
 * A controlled select target can also be used for a non-filterable select.
 * Then the select itself is the focusable combobox, it gets the label and handles the keyboard navigation.
 *
 * **The controlled target must not be or contain any focusable element in this case**,
 * e.g. use a `Tag` without `onClick` or a text instead of a `Button`.
 * Focusable elements are removed from the Tab order and hidden from screen readers by the select,
 * so they would not work as expected and their text is not announced as the selected value.
 *
 * If you need a focusable element like a `Button` anyway, then add the selected value in a hidden `span`
 * that is still accessible to screen readers:
 *
 * ```tsx
 * <Select filterable={false} {...otherSelectProps}>
 *     <>
 *         <Button text={selectedValue} />
 *         <ApplicationViewability hide="screen">
 *             <span>{selectedValue}</span>
 *         </ApplicationViewability>
 *     </>
 * </Select>
 * ```
 */
export const ControlledTargetNotFilterable = Template.bind({});
ControlledTargetNotFilterable.args = {
    ...Default.args,
    fill: false,
    filterable: false,
    children: <Tag>Controlled select target</Tag>,
    onActiveItemChange: fn(),
};

/**
 * If the selection is not mandatory it is suggested to add an option letting the user reset the select value.
 * `onClearanceHandler` follows the pattern to add a button on the right side of the element.
 * An alternate way would be to add an additional select item to reset the value but this could come with a few usablity issues:
 * user do not see it when the options are filtered, or the "empty" select option leads to the pre-selected option, etc.
 */
export const ClearanceOption = Template.bind({});
ClearanceOption.args = {
    ...Default.args,
    text: "Example selection",
    onClearanceText: "Reset the selection",
    //onClearanceHandler: false,
    onClearanceHandler: () => {
        alert("Reset now.");
    },
    onActiveItemChange: fn(),
};

/**
 * Select an existing language tag or enter another, such as `es-MX`.
 * `createNewItemFromQuery` builds the custom value, `createNewItemRenderer` displays its option,
 * and `onItemSelect` handles both existing and custom values.
 * This example restricts tags to letters and hyphen-separated subtags; creation is disabled for other input.
 */
export const CreatingItems: StoryFn<typeof Select> = () => {
    const [query, setQuery] = React.useState("");
    const [selected, setSelected] = React.useState("en");
    const [createActive, setCreateActive] = React.useState(false);
    const createOptionId = `create-language-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const isLanguageTag = (value: string) => /^[a-zA-Z]+(?:-[a-zA-Z0-9]+)*$/.test(value);
    const canCreate = isLanguageTag(query);

    return (
        <FieldItem
            labelProps={{ text: "Language" }}
            helperText="Choose a language tag or enter another, such as es-MX."
        >
            <Select<string>
                items={["en", "de", "fr"]}
                text={selected}
                query={query}
                onQueryChange={setQuery}
                inputProps={{
                    "aria-label": "Search languages",
                    ...(createActive ? { "aria-activedescendant": canCreate ? createOptionId : undefined } : {}),
                }}
                itemPredicate={(search, item) => item.toLowerCase().includes(search.toLowerCase())}
                itemRenderer={(item, { id, handleClick, handleFocus, modifiers }) => (
                    <MenuItem
                        key={item}
                        id={id}
                        text={item}
                        role="option"
                        roleStructure="none"
                        active={modifiers.active}
                        aria-selected={modifiers.active}
                        tabIndex={-1}
                        onFocus={handleFocus}
                        onClick={handleClick}
                    />
                )}
                // Offer custom values only when the query matches the allowed tag format.
                createNewItemFromQuery={canCreate ? (value) => (isLanguageTag(value) ? value : []) : undefined}
                createNewItemRenderer={(value, active, handleClick) =>
                    isLanguageTag(value) ? (
                        <MenuItem
                            id={createOptionId}
                            text={`Use language tag "${value}"`}
                            role="option"
                            roleStructure="none"
                            active={active}
                            aria-selected={active}
                            tabIndex={-1}
                            onClick={handleClick}
                        />
                    ) : undefined
                }
                onActiveItemChange={(_item, isCreateNewItem) => setCreateActive(isCreateNewItem)}
                onItemSelect={(item) => {
                    setSelected(item);
                    setCreateActive(false);
                }}
                contextOverlayProps={{ onClosing: () => setCreateActive(false) }}
            />
        </FieldItem>
    );
};
