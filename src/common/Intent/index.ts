import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export const Definitions = {
    PRIMARY: "primary",
    ACCENT: "accent",
    NEUTRAL: "neutral",
    SUCCESS: "success",
    INFO: "info",
    WARNING: "warning",
    DANGER: "danger",
}

const classNamesCreation = () => {
    const intentClasses = {...Definitions};
    for (let intentDefinition in Definitions) {
        intentClasses[intentDefinition] = `${eccgui}-intent-${Definitions[intentDefinition]}`;
    }
    return intentClasses;
}

export const ClassNames = classNamesCreation();

export type IntenTypes = keyof typeof Definitions;
