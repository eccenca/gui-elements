import Color from "color";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

import CssCustomProperties from "./CssCustomProperties";

// Configurations can be found in `src/css/react-flow.css` (the `.eccgui-configuration--colors__*` blocks)
type colorconfigs = "react-flow-graph" | "react-flow-linking" | "react-flow-workflow" | "stickynotes";

const colorConfigurationMemo = new Map<colorconfigs, Record<string, string>>();

/**
 * Read and returns color values provided by CSS custom properties.
 * They are defined for special CSS classes.
 * Currently color configurations for the react flow editors are supported.
 *
 * @deprecated Fragile CSSOM scraping (via {@link CssCustomProperties}): it walks
 * `document.styleSheets`, so it silently returns nothing for rules in a CORS-blocked
 * cross-origin stylesheet, and it depends on the injected probe element already being
 * attached and styled when read (load-order sensitive — race-prone with async CSS/chunk
 * loading). It only works at all because the color blocks it reads
 * (`.eccgui-configuration--colors__react-flow-*` / `__stickynotes` in
 * `src/css/react-flow.css`) happen to be same-origin, always-loaded, unlayered CSS.
 * Prefer a typed source instead: `src/configuration/colorPalette.ts` (the palette's single
 * source of truth) for raw color values, or a plain TS map keyed the same way as these
 * CSS classes for the per-context (react-flow-graph / -linking / -workflow / stickynotes)
 * groupings — no such typed map exists yet; introducing one and migrating callers is
 * future work. NOT migrated here: silk workspace deep-imports this function directly
 * (`app/views/shared/ArtefactTag.tsx`, `RuleEditor.utils.ts`, `sidebar/RuleOperator.tsx`),
 * so removing it requires updating those call sites first.
 **/
const getColorConfiguration = (configId: colorconfigs): Record<string, string> => {
    if (!colorConfigurationMemo.has(configId)) {
        const selectorClass = `${eccgui}-configuration--colors__${configId}`;
        colorConfigurationMemo.set(
            configId,
            Object.fromEntries(
                (
                    new CssCustomProperties({
                        selectorText: `.${selectorClass}`,
                        removeDashPrefix: true,
                        returnObject: false,
                    }).customProperties() as string[][]
                ).map((setting) => {
                    // check if the value could be a color

                    let testColorValue = setting[1];
                    // check if value itself is a reference to another css custom property
                    if (testColorValue.slice(0, 3) === "var") {
                        // we currently only extract the first part and ignore any fallbacks
                        const customPropertyName = /var\(\s*(--[a-zA-Z0-9_-]+)/g.exec(testColorValue);
                        if (customPropertyName && customPropertyName[1]) {
                            let selectorElement = document.getElementsByClassName(selectorClass)[0];
                            if (!selectorElement) {
                                // we need to add an empty element that the JS API can read the value of the custom prop
                                selectorElement = document.createElement("div");
                                selectorElement.classList.add(selectorClass);
                                selectorElement.setAttribute("style", "display: none");
                                document.body.appendChild(selectorElement);
                            }
                            // only check 1 time, not recursive
                            testColorValue = getComputedStyle(selectorElement).getPropertyValue(customPropertyName[1]);
                        }
                    }

                    try {
                        if (Color(testColorValue)) {
                            return [setting[0], testColorValue];
                        } else {
                            return [setting[0], undefined];
                        }
                    } catch {
                        return [setting[0], undefined];
                    }
                }),
            ) as Record<string, string>,
        );
    }
    return colorConfigurationMemo.get(configId)!;
};

export default getColorConfiguration;
