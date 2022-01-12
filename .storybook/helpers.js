import React from "react";
import Icon from "../src/components/Icon/Icon";
// argTypes helpers

export const helpersArgTypes = {
    handlerOnClick: {
        control: "select",
        options: ["None", "Handler"],
        mapping: {
            None: false,
            Handler: () => { alert("clicked"); },
        },
        defaultValue: false,
    },
    exampleIcon: {
        control: "select",
        options: ["None", "Example icon"],
        mapping: {
            None: false,
            "Example icon": <Icon name="Undefined" />,
        },
        defaultValue: false,
    },
}
