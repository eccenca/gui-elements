import { Meta } from "@storybook/react";

import { MultiSelect } from "./../../../index";
export { Default } from "../MultiSuggestField/MultiSuggestField.stories";

export default {
    title: "Forms/MultiSelect",
    component: MultiSelect,
    parameters: {
        controls: {
            exclude: /.*/g,
        },
    },
} as Meta<typeof MultiSelect>;
