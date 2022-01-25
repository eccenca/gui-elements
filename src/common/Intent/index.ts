import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export const Definitions = {
    PRIMARY: "primary" as "primary",
    ACCENT: "accent" as "accent",
    NEUTRAL: "neutral" as "neutral",
    SUCCESS: "success" as "success",
    INFO: "info" as "info",
    WARNING: "warning" as "warning",
    DANGER: "danger" as "danger",
}

const classNamesCreation = () => {
    const intentClasses = {...Definitions};
    for (let intentDefinition in Definitions) {
        intentClasses[intentDefinition] = `${eccgui}-intent--${Definitions[intentDefinition]}`;
    }
    return intentClasses;
}

export const ClassNames = classNamesCreation();

export type IntentTypes = typeof Definitions[keyof typeof Definitions];
