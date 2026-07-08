import { Intent as BlueprintIntent } from "@blueprintjs/core";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/** @deprecated (v27) use `IntentBlueprint` instead */
export const DefinitionsBlueprint = BlueprintIntent;
export const IntentBlueprint = BlueprintIntent;
export type IntentBlueprint = BlueprintIntent;

export type IntentTypes = IntentBlueprint | "neutral" | "accent" | "info";

export const Definitions: { [key: string]: IntentTypes } = {
    ...IntentBlueprint,
    ACCENT: "accent",
    NEUTRAL: "neutral",
    INFO: "info",
};

export const intentClassName = (intent: IntentTypes) => {
    return `${eccgui}-intent--${intent}`;
};

const classNamesCreation = () => {
    const intentClasses: { [key: string]: string } = {};
    for (const intentDefinition in Definitions) {
        intentClasses[intentDefinition] = intentClassName(Definitions[intentDefinition]);
    }
    return intentClasses;
};

export const ClassNames = classNamesCreation();
