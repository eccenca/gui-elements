import { Meta } from "@storybook/react";

import { MultiSelect } from "./../../../index";
export { Default } from "../MultiSuggest/MultiSuggest.stories";

export default {
    title: "Forms/MultiSelect",
    component: MultiSelect,
    parameters: {
        controls: {
            exclude: /.*/g,
        },
    },
} as Meta<typeof MultiSelect>;
