import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";

import { LanguageCombobox } from "../../index";

export default {
    title: "Components/LanguageCombobox",
    component: LanguageCombobox,
} as Meta<typeof LanguageCombobox>;

const Template: StoryFn<typeof LanguageCombobox> = (args) => {
    const [value, setValue] = useState(args.value ?? "");
    return (
        <div className="w-64">
            <LanguageCombobox {...args} value={value} onSelect={setValue} />
            <div className="mt-2 text-xs text-muted-foreground">selected: {value || "—"}</div>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = { value: "" };

export const Invalid = Template.bind({});
Invalid.args = { value: "", invalid: true };
