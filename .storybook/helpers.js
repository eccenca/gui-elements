import React from "react";
import Icon from "../src/components/Icon/Icon";
import canonicalIcons from "./../src/components/Icon/canonicalIconNames";
import { Definitions as IntentDefinitions } from "../src/common/Intent";
// argTypes helpers

const allIcons = new Map([
    ...Object.keys(canonicalIcons).map((keyId) => { return [keyId, <Icon name={keyId}/>] })
]);

export const helpersArgTypes = {
    handlerOnClick: {
        control: "select",
        options: ["Not set", "Handler"],
        mapping: {
            "Not set": undefined,
            Handler: () => { alert("clicked"); },
        },
    },
    exampleIcon: {
        control: "select",
        options: ["Not set", ...Object.keys(canonicalIcons)],
        mapping: {
            "Not set": undefined,
            ...Object.fromEntries(allIcons),
        },
    },
    exampleIntent: {
        control: "select",
        options: ["UNDEFINED", ...Object.keys(IntentDefinitions)],
        mapping: {
            "UNDEFINED": undefined,
            ...IntentDefinitions,
        },
    },
}
