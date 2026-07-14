import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/**
 * Intent system for gui-elements.
 *
 * The basic runtime string values are kept byte-identical to their historical
 * values so that the emitted CSS class names (see {@link intentClassName}) and
 * any values handed to consuming components stay unchanged.
 */

/**
 * The basic intents.
 */
export type BasicIntentTypes = "none" | "primary" | "success" | "warning" | "danger";

/**
 * Runtime map of the basic intents.
 */
export const BasicDefinitions: {
    NONE: "none";
    PRIMARY: "primary";
    SUCCESS: "success";
    WARNING: "warning";
    DANGER: "danger";
} = {
    NONE: "none",
    PRIMARY: "primary",
    SUCCESS: "success",
    WARNING: "warning",
    DANGER: "danger",
};

export type IntentTypes = BasicIntentTypes | "neutral" | "accent" | "info";

export const Definitions: { [key: string]: IntentTypes } = {
    ...BasicDefinitions,
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
