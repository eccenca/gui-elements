import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { helpersArgTypes } from "../../../../.storybook/helpers";
import characters from "../../../common/utils/characters";
import { TextFieldProps } from "../TextField";

import { TextField } from "./../../../../index";

export default {
    title: "Forms/TextField",
    component: TextField,
    argTypes: {
        leftIcon: {
            ...helpersArgTypes.exampleIcon,
        },
        rightElement: {
            ...helpersArgTypes.exampleIcon,
        },
        intent: {
            ...helpersArgTypes.exampleIntent,
        },
    },
} as Meta<typeof TextField>;

const Template: StoryFn<typeof TextField> = (args) => <TextField {...args}></TextField>;

export const Default = Template.bind({});

Default.args = {
    fullWidth: false,
    placeholder: "placeholder text",
    readOnly: false,
    disabled: false,
};

/** Text field with default value that contains a zero width/invisible character.
 * As long as the character exists, an alert is raised for every value change with a delay of 500ms.
 * Instead of an alert, something more sophisticated like a clean up action should be offered in production. */
export const InvisibleCharacterWarning = Template.bind({});

const invisibleCharacterWarningProps: TextFieldProps = {
    ...Default.args,
    invisibleCharacterWarning: {
        callback: (codePoints) => {
            if (codePoints.size) {
                const codePointsString = [...Array.from(codePoints)]
                    .map((n) => {
                        const info = characters.invisibleZeroWidthCharacters.codePointMap.get(n);
                        return info?.fullLabel;
                    })
                    .join(", ");
                alert("Invisible character detected in input string. Code points: " + codePointsString);
            }
        },
        callbackDelay: 500,
    },
    onChange: () => {
        /** needs to be defined, else the invisible character warning callback will not be triggered. */
    },
    defaultValue: "Invisible character ->​<-",
};
InvisibleCharacterWarning.args = invisibleCharacterWarningProps;
