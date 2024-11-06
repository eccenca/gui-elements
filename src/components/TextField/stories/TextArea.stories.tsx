import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../../.storybook/helpers";

import { Button, IconButton, TextArea } from "./../../../../index";
type TextAreaType = typeof TextArea;

export default {
    title: "Forms/TextArea",
    component: TextArea,
    argTypes: {
        leftIcon: {
            ...helpersArgTypes.exampleIcon,
        },
        rightElement: {
            control: helpersArgTypes.exampleIcon.control,
            options: [...helpersArgTypes.exampleIcon.options, "Button element", "2 Icon buttons"],
            mapping: {
                ...helpersArgTypes.exampleIcon.mapping,
                "Button element": (
                    <Button small onClick={() => alert("clicked")}>
                        Button label
                    </Button>
                ),
                "2 Icon buttons": (
                    <>
                        <IconButton
                            name={"item-comment"}
                            onClick={() => alert("1 clicked")}
                            text="Button 1"
                            affirmative
                        />
                        <IconButton name={"item-edit"} onClick={() => alert("2 clicked")} text="Button 2" />
                    </>
                ),
            },
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
        },
    },
} as Meta<TextAreaType>;

const Template: StoryFn<TextAreaType> = (args) => <TextArea {...args}></TextArea>;

export const Default = Template.bind({});
Default.args = {
    rows: 10,
    wrapperDivProps: {
        "data-test-id": "textarea-test-id",
        "data-testid": "textarea-testid",
    },
};
