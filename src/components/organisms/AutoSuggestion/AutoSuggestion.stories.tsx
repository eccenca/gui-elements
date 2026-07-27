import React from "react";
// Blueprint removed: inert passthrough (the former OverlaysProvider context is no longer needed)
const OverlaysProvider = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
import { Meta, StoryFn } from "@storybook/react";
import { fn } from "storybook/test";

import { helpersArgTypes } from "../../../../.storybook/helpers";

import {
    CodeAutocompleteField,
    CodeAutocompleteFieldPartialAutoCompleteResult,
    CodeAutocompleteFieldProps,
} from "./AutoSuggestion";

/**
 * `AutoSuggestion.tsx` (this folder) is a deprecated compatibility re-export of the public
 * `CodeAutocompleteField` component, whose implementation lives in
 * `src/components/organisms/CodeAutocompleteField/AutoSuggestion` (together with a few internal
 * helper components). This story exercises the component via that legacy entry point with a
 * minimal, static `fetchSuggestions`/`checkInput` setup; see `Forms/CodeAutocompleteField` for
 * further scenarios.
 */
export default {
    title: "Forms/AutoSuggestion",
    component: CodeAutocompleteField,
    argTypes: {
        intent: {
            ...helpersArgTypes.exampleIntent,
            options: ["UNDEFINED", "primary", "accent", "success", "warning", "danger"],
        },
    },
    args: {
        onInputChecked: fn(),
    },
} as Meta<typeof CodeAutocompleteField>;

let forcedUpdateKey = 0; // @see https://github.com/storybookjs/storybook/issues/13375#issuecomment-1291011856
const Template: StoryFn<typeof CodeAutocompleteField> = (args) => (
    <OverlaysProvider>
        <CodeAutocompleteField {...args} key={++forcedUpdateKey} />
    </OverlaysProvider>
);

// A small set of languages the mocked `fetchSuggestions` completes the last typed word against.
const languages = ["javascript", "typescript", "python", "scala", "sparql", "turtle"];

const defaultProps: CodeAutocompleteFieldProps = {
    initialValue: "",
    fetchSuggestions(
        inputString: string,
        cursorPosition: number,
    ):
        | CodeAutocompleteFieldPartialAutoCompleteResult
        | undefined
        | Promise<CodeAutocompleteFieldPartialAutoCompleteResult | undefined> {
        const stringBeforeCursor = inputString.substring(0, cursorPosition);
        const lastSpaceIdx = stringBeforeCursor.lastIndexOf(" ");
        const searchWordStart = lastSpaceIdx >= 0 ? lastSpaceIdx + 1 : 0;
        const lastWordBeforeCursor = stringBeforeCursor
            .substring(searchWordStart, stringBeforeCursor.length)
            .toLowerCase()
            .trim();
        if (!lastWordBeforeCursor) {
            return undefined;
        }
        const replacements = languages.filter((language) => language.startsWith(lastWordBeforeCursor));
        if (replacements.length) {
            return {
                cursorPosition: cursorPosition,
                inputString: inputString,
                replacementResults: [
                    {
                        extractedQuery: lastWordBeforeCursor,
                        replacementInterval: {
                            from: searchWordStart,
                            length: lastWordBeforeCursor.length,
                        },
                        replacements: replacements.map((language) => ({
                            label: language,
                            description: `Auto-complete to '${language}'`,
                            value: language,
                        })),
                    },
                ],
            };
        }
        return undefined;
    },
    placeholder: "Start typing a language name, e.g. 'type' or 'spa'.",
    onChange(): void {
        // Do nothing
    },
};

/** Offers auto-completion for the (partial) word right before the cursor from a static list. */
export const Default = Template.bind({});
Default.args = defaultProps;

/** Uses `checkInput` to validate the current value; the input is marked invalid while it contains the word 'error'. */
export const WithValidation = Template.bind({});
WithValidation.args = {
    ...defaultProps,
    initialValue: "contains error",
    checkInput: (inputString: string) => {
        const errorIndex = inputString.indexOf("error");
        if (errorIndex >= 0) {
            return {
                valid: false,
                parseError: {
                    message: "Strings containing the sub-string 'error' are NOT allowed.",
                    start: errorIndex,
                    end: errorIndex + "error".length,
                },
            };
        }
        return {
            valid: true,
        };
    },
};

/** Allows the input to span multiple lines; suggestions are still computed per line. */
export const Multiline = Template.bind({});
Multiline.args = {
    ...defaultProps,
    multiline: true,
    height: 120,
};
