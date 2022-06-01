import CssCustomProperties from "./CssCustomProperties";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

// Configurations can be found in `src/cmem/react-flow/configuration/_colors-*.scss`
type colorconfigs = "react-flow-graph" | "react-flow-linking" | "react-flow-workflow" | "stickynotes";

/**
 * Read and returns color values provided by CSS custom properties.
 * They are defined for special CSS classes.
 * Currently color configurations for the react flow editors are supported.
 **/
const getColorConfiguration = (configId: colorconfigs) => {
    return new CssCustomProperties({
        selectorText: `.${eccgui}-configuration--colors__${configId}`,
        cssRuleType: "CSSStyleRule",
        removeDashPrefix: true,
        returnObject: true,
    }).customProperties();
};

export default getColorConfiguration;
