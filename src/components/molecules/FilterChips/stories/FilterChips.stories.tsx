import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { FilterChips, Icon } from "@/";

export default {
    title: "Components/FilterChips",
    component: FilterChips,
    argTypes: {
        onChange: { action: "changed" },
    },
} as Meta<typeof FilterChips>;

const Template: StoryFn<typeof FilterChips> = (args) => {
    const [selected, setSelected] = React.useState(args.selectedChipId);
    return (
        <FilterChips
            {...args}
            selectedChipId={selected}
            onChange={(id) => {
                setSelected(id);
                args.onChange?.(id);
            }}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    selectedChipId: "all",
    chips: [
        { id: "all", label: "All" },
        { id: "comparison", label: "Comparison", activeColor: "#745a85" },
        { id: "transform", label: "Transform", activeColor: "#5a7885" },
        { id: "aggregation", label: "Aggregation", activeColor: "#85755a" },
    ],
};

export const WithIcons = Template.bind({});
WithIcons.args = {
    selectedChipId: "list",
    chips: [
        { id: "list", label: "List", icon: <Icon name="item-viewdetails" small /> },
        { id: "settings", label: "Settings", icon: <Icon name="item-settings" small /> },
    ],
};
