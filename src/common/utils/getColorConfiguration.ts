import CssCustomProperties from "./CssCustomProperties";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

const getColorConfiguration = (configId: string) => {
    return new CssCustomProperties({
        selectorText: `.${eccgui}-configuration--colors__${configId}`,
        cssRuleType: "CSSStyleRule",
        removeDashPrefix: true,
        returnObject: true,
    }).customProperties();
};

export default getColorConfiguration;
