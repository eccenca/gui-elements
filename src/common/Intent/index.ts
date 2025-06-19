import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { Intent as BlueprintIntent } from "@blueprintjs/core";

export type IntentBlueprint = BlueprintIntent;
export const DefinitionsBlueprint = BlueprintIntent;

export type IntentTypes = IntentBlueprint | "neutral" | "accent" | "info";

export const Definitions: { [key: string]: IntentTypes } = {
    ...DefinitionsBlueprint,
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
