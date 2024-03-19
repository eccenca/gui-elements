import React from "react";
import { LogoReact } from "@carbon/icons-react";

import { Icon, TestIcon } from "../src/";
import { Definitions as IntentDefinitions } from "../src/common/Intent";

import canonicalIcons from "./../src/components/Icon/canonicalIconNames";
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
                alert("clicked");
            },
        },
    },
    exampleIcon: {
        control: "select",
        options: ["Not set", "Test icon", ...Object.keys(canonicalIcons)],
        mapping: {
            "Not set": undefined,
            "Test icon": <TestIcon tryout={LogoReact} className="testclass-icon" />,
            ...Object.fromEntries(allIcons),
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
