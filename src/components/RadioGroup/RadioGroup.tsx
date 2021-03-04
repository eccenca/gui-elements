import React from 'react';
import {
    RadioGroup as BlueprintRadioGroup,
    Radio,
} from "@blueprintjs/core";

function RadioGroup(
    {
        buttons=[],
        ...restProps
    }: any) {
    return (
        <BlueprintRadioGroup
            {...restProps}
        >
            {
                buttons.map(button => {
                    return (
                        <Radio
                            key={button.value}
                            name={button.value}
                            value={button.value}
                            label={button.label}
                            checked={button.checked}
                        />
                    );
                })
            }
        </BlueprintRadioGroup>
    );
};

export default RadioGroup;
