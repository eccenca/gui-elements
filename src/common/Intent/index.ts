import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export type IntentTypes = "none" | "neutral" | "primary" | "accent" | "info" | "success" | "warning" | "danger";

export const Definitions: { [key: string]: IntentTypes; } = {
    PRIMARY: "primary",
    ACCENT: "accent",
    NEUTRAL: "neutral",
    NONE: "none",
    SUCCESS: "success",
    INFO: "info",
    WARNING: "warning",
    DANGER: "danger",
}

export const intentClassName = (intent: IntentTypes) => {
    return `${eccgui}-intent--${intent}`
}

const classNamesCreation = () => {
    const intentClasses : { [key: string]: string; } = {};
    for (let intentDefinition in Definitions) {
        intentClasses[intentDefinition] = intentClassName(Definitions[intentDefinition]);
    }
    return intentClasses;
}

export const ClassNames = classNamesCreation();
