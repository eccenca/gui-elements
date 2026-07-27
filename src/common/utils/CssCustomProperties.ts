/**
 * Based on CSS Tricks tutorial.
 * @see https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/
 *
 * @deprecated This reads custom properties by scraping the live CSSOM
 * (`document.styleSheets` → `cssRules`), which is fragile in a few concrete ways:
 * - `stylesheet.cssRules` throws/returns nothing for a cross-origin, CORS-blocked
 *   stylesheet (silent data loss, not an error the caller can react to).
 * - it only sees rules from stylesheets that happen to already be attached to `document`
 *   when called — async-loaded CSS (chunked bundles, late-mounted `<style>` tags) that
 *   hasn't landed yet is invisible; there's no re-read on style-sheet load.
 * - it re-parses every local stylesheet's rule list on each lookup (memoized per instance,
 *   but not across instances), which is wasted work compared to a static, typed source.
 *
 * The only current consumer is {@link getColorConfiguration}, itself deprecated for the
 * same reasons — see that function's doc comment for the intended replacement
 * (`src/configuration/colorPalette.ts` + a typed per-context color map, not yet written)
 * and for why silk's deep imports mean this can't just be deleted yet.
 */

type AllowedCSSRule = CSSStyleRule | CSSPageRule; // they have necessary `selectorText` and `style` properties

interface getLocalCssStyleRulesProps {
    cssRuleType?: "CSSStyleRule";
    selectorText?: string;
}
interface getLocalCssStyleRulePropertiesProps extends getLocalCssStyleRulesProps {
    propertyType?: "all" | "normal" | "custom";
}
interface getCustomPropertiesProps extends getLocalCssStyleRulesProps {
    filterName?: (name: string) => boolean;
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

    customProperties = (props: getCustomPropertiesProps = {}): [string, string][] | Record<string, string> => {
        // FIXME:
        // in case of performance issues results should get saved at least into intern variables
        // other cache strategies could be also tested
        if (Object.keys(this.customprops).length > 1) {
            return this.customprops;
        }
        const customprops = CssCustomProperties.listCustomProperties({
            ...this.getterDefaultProps,
            ...props,
        });
        this.customprops = customprops;
        return customprops;
    };

    static listLocalStylesheets = (): CSSStyleSheet[] => {
        if (document && document.styleSheets) {
            return (Array.from(document.styleSheets) as CSSStyleSheet[]).filter((stylesheet) => {
                // is inline stylesheet or from same domain
                if (!stylesheet.href) {
                    return true;
                }
                return stylesheet.href.indexOf(window.location.origin) === 0;
            });
        }

        return [] as CSSStyleSheet[];
    };

    static listLocalCssRules = (): CSSRule[] => {
        return CssCustomProperties.listLocalStylesheets()
            .map((stylesheet) => {
                return Array.from(stylesheet.cssRules);
            })
            .flat();
    };

    static listLocalCssStyleRules = (filter: getLocalCssStyleRulesProps = {}): CSSStyleRule[] => {
        const { cssRuleType = "CSSStyleRule", selectorText } = filter;
        const cssStyleRules = CssCustomProperties.listLocalCssRules().filter((rule) => {
            const cssrule = rule as AllowedCSSRule;
            if (cssrule.style) {
                if (cssrule.constructor.name !== cssRuleType) {
                    return false;
                }
                if (!!selectorText && cssrule.selectorText !== selectorText) {
                    return false;
                }
                return true;
            } else {
                return false;
            }
        });
        return cssStyleRules as CSSStyleRule[];
    };

    static listLocalCssStyleRuleProperties = (filter: getLocalCssStyleRulePropertiesProps = {}): string[][] => {
        const { propertyType = "all", ...otherFilters } = filter;
        return CssCustomProperties.listLocalCssStyleRules(otherFilters)
            .map((cssrule) => {
                return [...(cssrule as CSSStyleRule).style].map((propertyname) => {
                    return [propertyname.trim(), (cssrule as CSSStyleRule).style.getPropertyValue(propertyname).trim()];
                });
            })
            .flat()
            .filter((declaration) => {
                switch (propertyType) {
                    case "normal":
                        return declaration[0].indexOf("--") !== 0;
                    case "custom":
                        return declaration[0].indexOf("--") === 0;
                }
                return true; // case "all"
            });
    };

    static listCustomProperties = (
        props: getCustomPropertiesProps = {},
    ): [string, string][] | Record<string, string> => {
        const { removeDashPrefix = true, returnObject = true, filterName = () => true, ...filterProps } = props;

        const customProperties = CssCustomProperties.listLocalCssStyleRuleProperties({
            ...filterProps,
            propertyType: "custom",
        })
            .filter((declaration) => {
                return filterName(declaration[0]);
            })
            .map((declaration) => {
                if (removeDashPrefix) {
                    return [declaration[0].substr(2), declaration[1]];
                }
                return declaration;
            });

        return returnObject
            ? (Object.fromEntries(customProperties) as Record<string, string>)
            : (customProperties as [string, string][]);
    };
}
