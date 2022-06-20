/**
 * Based on CSS Tricks tutorial.
 * @see https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/
 */

interface getLocalCssStyleRulesProps {
    selectorText?: string;
}
interface getLocalCssStyleRulePropertiesProps extends getLocalCssStyleRulesProps {
    propertyType?: "all" | "normal" | "custom";
}
interface getCustomPropertiesProps extends getLocalCssStyleRulesProps {
    removeDashPrefix?: boolean;
    returnObject?: boolean;
}

export default class CssCustomProperties {

    getterDefaultProps = {} as getCustomPropertiesProps;
    customprops = {};

    constructor(props: getCustomPropertiesProps = {}) {
        this.getterDefaultProps = props;
    }

    // Methods

    customProperties = (props: getCustomPropertiesProps = {}) => {
        // FIXME:
        // in case of performance issues results should get saved at least into intern variables
        // other cache strategies could be also tested
        if (Object.keys(this.customprops).length > 1) {
            return this.customprops;
        }
        const customprops = CssCustomProperties.listCustomProperties({
            ...this.getterDefaultProps,
            ...props
        });
        this.customprops = customprops;
        return customprops;
    }

    static listLocalStylesheets = () => {
        if (document && document.styleSheets) {
            return Array.from(document.styleSheets)
                .filter((stylesheet) => {
                    // is inline stylesheet or from same domain
                    if (!stylesheet.href) {
                        return true;
                    }
                    return stylesheet.href.indexOf(window.location.origin) === 0;
                });
        }

        return [];
    }

    static listLocalCssRules = () => {
        return CssCustomProperties.listLocalStylesheets()
            .map((stylesheet) => {
                return Array.from(stylesheet.cssRules);
            })
            .flat();
    }

    static listLocalCssStyleRules = (filter: getLocalCssStyleRulesProps = {}) => {
        const {selectorText} = filter;
        return CssCustomProperties.listLocalCssRules()
            .filter((cssrule) => {
                if (!(cssrule instanceof CSSStyleRule)) { return false; }
                if (!!selectorText && cssrule.selectorText !== selectorText) { return false; }
                return true;
            })
    }

    static listLocalCssStyleRuleProperties = (filter: getLocalCssStyleRulePropertiesProps = {}) => {
        const { propertyType = "all", ...otherFilters } = filter;
        return CssCustomProperties.listLocalCssStyleRules(otherFilters)
            .map((cssrule) => {
                return [...(cssrule as CSSStyleRule).style]
                    .map((propertyname) => {
                        return [
                            propertyname.trim(),
                            (cssrule as CSSStyleRule).style.getPropertyValue(propertyname).trim()
                        ];
                    });
            })
            .flat()
            .filter((declaration) => {
                switch(propertyType) {
                    case "normal":
                        return declaration[0].indexOf("--") !== 0;
                    case "custom":
                        return declaration[0].indexOf("--") === 0;
                }
                return true; // case "all"
            });
    }

    static listCustomProperties = (props: getCustomPropertiesProps = {}) => {
        const {
            removeDashPrefix = true,
            returnObject = true,
            ...filterProps
        } = props;

        const customProperties = CssCustomProperties.listLocalCssStyleRuleProperties({
            ...filterProps,
            propertyType: "custom",
        }).map((declaration) => {
            if (removeDashPrefix) {
                return [
                    declaration[0].substr(2),
                    declaration[1]
                ];
            }
            return declaration;
        });

        return returnObject ? Object.fromEntries(customProperties) : customProperties;
    }
}
