import React, { useCallback, useState } from "react";
import { loremIpsum } from "react-lorem-ipsum";

import { MultiSelectSelectionProps } from "../../MultiSelect/MultiSelect";
import { MultiSuggestField } from "../MultiSuggestField";

const testLabels = loremIpsum({
    p: 1,
    avgSentencesPerParagraph: 5,
    avgWordsPerSentence: 1,
    startWithLoremIpsum: false,
    random: false,
})
    .toString()
    .split(".")
    .map((item) => item.trim());

export const items = new Array(5).fill(undefined).map((_, id) => {
    const testLabel = testLabels[id];
    return { testLabel, testId: `${testLabel}-id` };
});

export const TestComponent = (): JSX.Element => {
    const copy: Array<{ testLabel: string; testId: string }> = [items[2]];

    const [selected, setSelected] = useState(copy);

    const handleOnSelect = useCallback((params: MultiSelectSelectionProps<{ testLabel: string; testId: string }>) => {
        const items = params.selectedItems;
        setSelected(items);
    }, []);

    const handleReset = (): void => {
        setSelected(copy);
    };

    return (
        <div>
            <button data-testid="reset-button" onClick={handleReset}>
                Reset
            </button>
            <br />
            <br />
            <MultiSuggestField<{ testLabel: string; testId: string }>
                items={items}
                createNewItemFromQuery={(query) => ({ testId: `${query}-id`, testLabel: query })}
                onSelection={handleOnSelect}
                itemId={({ testId }) => testId}
                itemLabel={({ testLabel }) => testLabel}
                selectedItems={selected}
            />
        </div>
    );
};
