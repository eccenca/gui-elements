import { Meta } from "@storybook/react";

import { AutoSuggestion } from "./../../../index";
export { Default } from "../CodeAutocompleteField/CodeAutocompleteField.stories";

export default {
    title: "Forms/AutoSuggestion",
    component: AutoSuggestion,
    parameters: {
        controls: {
            exclude: /.*/g,
        },
    },
} as Meta<typeof AutoSuggestion>;
