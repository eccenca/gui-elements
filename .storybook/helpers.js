import React from "react";
import Icon from "../src/components/Icon/Icon";
// argTypes helpers

export const helpersArgTypes = {
    handlerOnClick: {
        control: "select",
        options: ["Not set", "Handler"],
        mapping: {
            "Not set": undefined,
            Handler: () => { alert("clicked"); },
        },
        defaulValue: undefined,
    },
    exampleIcon: {
        control: "select",
        options: ["Not set", "Example icon \"Undefined\""],
        mapping: {
            "Not set": undefined,
            "Example icon \"Undefined\"": <Icon name="Undefined" />,
        },
        table: {
            defaultValue: { summary: undefined },
            type: { summary: "Icon | string" },
        }
    },
}
