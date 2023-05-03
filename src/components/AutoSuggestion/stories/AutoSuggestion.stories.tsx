import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TextField } from "./../../../../index";
import { helpersArgTypes } from "../../../../.storybook/helpers";
import AutoSuggestion, {IPartialAutoCompleteResult, IProps} from "../AutoSuggestion";

export default {
    title: "Forms/AutoSuggestion",
    component: AutoSuggestion,
    argTypes: {}
} as ComponentMeta<typeof AutoSuggestion>;

const Template: ComponentStory<typeof AutoSuggestion> = (args) => (
    <AutoSuggestion {...args}></AutoSuggestion>
);

const resultList = [
    "find me",
    "item",
    "auto-completion result"
]

const defaultProps: IProps = {
    initialValue: "",
    fetchSuggestions(inputString: string, cursorPosition: number): IPartialAutoCompleteResult | undefined | Promise<IPartialAutoCompleteResult | undefined> {
        const stringBeforeCursor = inputString.substring(0, cursorPosition)
        const lastSpaceIdx = stringBeforeCursor.lastIndexOf(" ")
        const searchWordStart = lastSpaceIdx >= 0 ? lastSpaceIdx + 1 : 0
        const lastWordBeforeCursor = stringBeforeCursor.substring(searchWordStart, stringBeforeCursor.length).toLowerCase().trim()
        const replacements = resultList.filter(item => item.toLowerCase().includes(lastWordBeforeCursor))
        if (replacements.length) {
            return {
                cursorPosition: cursorPosition,
                inputString: inputString,
                replacementResults: [{
                    extractedQuery: lastWordBeforeCursor,
                    replacementInterval: {
                        from: searchWordStart,
                        length: lastWordBeforeCursor.length
                    },
                    replacements: replacements.map((v) => ({
                        label: `Label of '${v}'`,
                        description: `Description of '${v}'`,
                        value: v
                    }))
                }]
            }
        }
    },
    placeholder: "The word before the cursor will be auto-completed. At the beginning or after a space, all results are shown.",
    onChange(): any {
        // Do nothing
    },
}

/** Offers basic auto-completion for the word right before the cursor. */
export const Default = Template.bind({});

Default.args = defaultProps

/** Shows validation error if the input string contains the word 'not'. */
export const WithValidation = Template.bind({});

WithValidation.args = {
    ...defaultProps,
    initialValue: "Contains not",
    checkInput: (inputString) => {
        const notIndex = inputString.indexOf("not")
        if(notIndex >= 0) {
            return {
                valid: false,
                parseError: {
                    message: "Strings containing the sub-string 'not' are NOT allowed.",
                    start: notIndex,
                    end: notIndex + 3
                }
            }
        } else {
            return {
                valid: true
            }
        }
    }
}
