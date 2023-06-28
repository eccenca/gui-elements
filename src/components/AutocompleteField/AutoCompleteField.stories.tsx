import { Meta } from "@storybook/react";

import { AutoCompleteField } from "./../../../index";
export { Default } from "../SuggestField/SuggestField.stories";

export default {
    title: "Forms/AutoCompleteField",
    component: AutoCompleteField,
    parameters: {
        controls: {
            exclude: /.*/g,
        },
    },
} as Meta<typeof AutoCompleteField>;
