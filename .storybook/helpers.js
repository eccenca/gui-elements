import React from "react";
import { Rocket } from "lucide-react";

import { Icon, TestIcon } from "../src/";
import { Definitions as IntentDefinitions } from "../src/common/Intent";

import canonicalIcons from "./../src/components/atoms/Icon/canonicalIconNames";

// argTypes helpers

const allIcons = new Map([
    ...Object.keys(canonicalIcons).map((keyId) => {
        return [keyId, <Icon name={keyId} />];
    }),
]);

export const helpersArgTypes = {
    handlerOnClick: {
        control: "select",
        options: ["Not set", "Handler"],
        mapping: {
            "Not set": undefined,
            Handler: () => {
                // eslint-disable-next-line no-undef
                alert("clicked");
            },
        },
    },
    exampleIcon: {
        control: "select",
        options: ["Not set", "Test icon", ...Object.keys(canonicalIcons), "Icon with tooltip"],
        mapping: {
            "Not set": undefined,
            "Test icon": <TestIcon tryout={Rocket} className="testclass-icon" />,
            ...Object.fromEntries(allIcons),
            "Icon with tooltip": <Icon name={"item-info"} intent="info" tooltipText="Example tooltip" />,
        },
    },
    exampleIntent: {
        control: "select",
        options: ["UNDEFINED", ...Object.keys(IntentDefinitions), "edited", "removed"],
        mapping: {
            UNDEFINED: undefined,
            ...IntentDefinitions,
        },
    },
};
