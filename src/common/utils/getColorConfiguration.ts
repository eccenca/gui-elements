import Color from "color";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import CssCustomProperties from "./CssCustomProperties";

// Configurations can be found in `src/cmem/react-flow/configuration/_colors-*.scss`
type colorconfigs = "react-flow-graph" | "react-flow-linking" | "react-flow-workflow" | "stickynotes";

const colorConfigurationMemo = new Map<colorconfigs, Record<string, string>>();

/**
 * Read and returns color values provided by CSS custom properties.
 * They are defined for special CSS classes.
 * Currently color configurations for the react flow editors are supported.
 **/
const getColorConfiguration = (configId: colorconfigs): Record<string, string> => {
    if (!colorConfigurationMemo.has(configId)) {
        const selectorClass = `${eccgui}-configuration--colors__${configId}`;
        const colorConfiguration = Object.fromEntries(
            (
                new CssCustomProperties({
                    selectorText: `.${selectorClass}`,
                    removeDashPrefix: true,
                    returnObject: false,
                }).customProperties() as string[][]
            ).map((setting) => {
                // check if the value could be a color, `var()` references are already resolved
                try {
                    Color(setting[1]);
                    return [setting[0], setting[1]];
                } catch {
                    return [setting[0], undefined];
                }
            }),
        ) as Record<string, string>;

        if (Object.keys(colorConfiguration).length === 0) {
            // an empty result is not cached, the stylesheets may be loaded later on
            return colorConfiguration;
        }

        colorConfigurationMemo.set(configId, colorConfiguration);
    }
    return colorConfigurationMemo.get(configId)!;
};

export default getColorConfiguration;
