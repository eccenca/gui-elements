import { CLASSPREFIX as eccgui } from "../../configuration/constants";

/**
 * Intent system for gui-elements.
 *
 * Foundation-independent: this module no longer imports anything from
 * `@blueprintjs/*`. The runtime string values below are kept byte-identical to
 * the historical Blueprint `Intent` values (`"none" | "primary" | "success" |
 * "warning" | "danger"`) so that the emitted CSS class names (see
 * {@link intentClassName}) and any values handed to consuming components stay
 * unchanged.
 */

/**
 * The four basic intents, mirroring the historical Blueprint `Intent` values.
 */
export type IntentBlueprint = "none" | "primary" | "success" | "warning" | "danger";

/**
 * Runtime map of the basic intents. Structurally identical to the historical
 * Blueprint `Intent` object (same keys, same string values, same order).
 */
export const DefinitionsBlueprint: {
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
