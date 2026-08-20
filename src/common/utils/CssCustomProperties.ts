/**
 * Based on CSS Tricks tutorial.
 * @see https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/
 *
 * The names of the custom properties are collected from the CSSOM, but their values are resolved
 * via the computed style of a matching element.
 * The CSSOM is only a reliable source for the names: declarations can be nested inside grouping
 * rules (`@layer`, `@media`, `@supports`, `@container`), and their document order does not
 * represent the cascade anymore, e.g. unlayered declarations win over layered ones.
 *
 * If the CSSOM does not provide any name, then the names can optionally be read from the computed
 * style of the element as well, see the `useComputedStyleFallback` option.
 */

type AllowedCSSRule = CSSStyleRule | CSSPageRule; // they have necessary `selectorText` and `style` properties

/** Rules that contain other rules, e.g. `@layer`, `@media`, `@supports`, `@container` or `@import`. */
type CssRuleWithChildren = CSSRule & { cssRules?: CSSRuleList; styleSheet?: CSSStyleSheet };

type CustomPropertyEntry = [string, string];

/** Element that supports the CSS typed object model, we only need to iterate over the property names. */
type TypedOMElement = Element & {
    computedStyleMap?: () => { forEach: (callback: (value: unknown, propertyName: string) => void) => void };
};

const rootSelectors = [":root", "html", ":root:root"];
const classSelectorPattern = /^(?:\.-?[_a-zA-Z][\w-]*)+$/;

interface getLocalCssStyleRulesProps {
    cssRuleType?: "CSSStyleRule";
    /**
     * Selector the rule needs to use, e.g. `:root`.
     * A rule matches if the selector is part of its selector list, e.g. `:root, :host`.
     */
    selectorText?: string;
}
interface getLocalCssStyleRulePropertiesProps extends getLocalCssStyleRulesProps {
    propertyType?: "all" | "normal" | "custom";
}
interface getCustomPropertiesProps extends getLocalCssStyleRulesProps {
    filterName?: (name: string) => boolean;
    removeDashPrefix?: boolean;
    returnObject?: boolean;
    /**
     * Read the property names from the computed style of the matching element if the CSSOM does not
     * provide any name, e.g. because the declarations are part of a stylesheet that cannot be read
     * or that is not listed by `document.styleSheets`, like constructed and adopted stylesheets.
     *
     * Disabled by default because it changes the result set: the computed style of an element also
     * contains all custom properties it inherits from its ancestors, e.g. everything defined for
     * `:root`, and it does not tell which rule declared them.
     */
    useComputedStyleFallback?: boolean;
}

export default class CssCustomProperties {
    getterDefaultProps = {} as getCustomPropertiesProps;
    customprops = {} as CustomPropertyEntry[] | Record<string, string>;

    constructor(props: getCustomPropertiesProps = {}) {
        this.getterDefaultProps = props;
    }

    // Methods

    customProperties = (props: getCustomPropertiesProps = {}): CustomPropertyEntry[] | Record<string, string> => {
        // FIXME:
        // in case of performance issues results should get saved at least into intern variables
        // other cache strategies could be also tested
        if (Object.keys(this.customprops).length > 0) {
            return this.customprops;
        }
        // an empty result is not cached, the stylesheets may be loaded later on
        const customprops = CssCustomProperties.listCustomProperties({
            ...this.getterDefaultProps,
            ...props,
        });
        this.customprops = customprops;
        return customprops;
    };

    static listLocalStylesheets = (): CSSStyleSheet[] => {
        if (typeof document !== "undefined" && document.styleSheets) {
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

    /** Rules of a stylesheet are not readable if it was loaded from another origin. */
    static readCssRules = (stylesheet: CSSStyleSheet): CSSRuleList | undefined => {
        try {
            return stylesheet.cssRules;
        } catch {
            return undefined;
        }
    };

    static listLocalCssRules = (): CSSRule[] => {
        const readStylesheets = new Set<CSSStyleSheet>();

        const collectRules = (rules: CSSRuleList | undefined): CSSRule[] => {
            if (!rules) {
                return [];
            }

            return Array.from(rules)
                .map((rule) => {
                    const ruleWithChildren = rule as CssRuleWithChildren;

                    if (ruleWithChildren.styleSheet) {
                        // `@import` rule, e.g. `@import url(theme.css) layer(theme)`
                        if (readStylesheets.has(ruleWithChildren.styleSheet)) {
                            return [];
                        }
                        readStylesheets.add(ruleWithChildren.styleSheet);
                        return collectRules(CssCustomProperties.readCssRules(ruleWithChildren.styleSheet));
                    }

                    if (ruleWithChildren.cssRules) {
                        // rule that groups or nests other rules, e.g. `@layer`, `@media` or `@container`
                        return [rule, ...collectRules(ruleWithChildren.cssRules)];
                    }

                    return [rule];
                })
                .flat();
        };

        return CssCustomProperties.listLocalStylesheets()
            .map((stylesheet) => {
                readStylesheets.add(stylesheet);
                return collectRules(CssCustomProperties.readCssRules(stylesheet));
            })
            .flat();
    };

    static isCssStyleRule = (rule: CSSRule): rule is CSSStyleRule => {
        if (typeof CSSStyleRule !== "undefined") {
            return rule instanceof CSSStyleRule;
        }
        const cssrule = rule as AllowedCSSRule;
        return !!cssrule.style && cssrule.selectorText !== undefined;
    };

    static matchesSelectorText = (rule: CSSStyleRule, selectorText: string): boolean => {
        return (rule.selectorText ?? "")
            .split(",")
            .map((selector) => selector.trim())
            .includes(selectorText.trim());
    };

    static listLocalCssStyleRules = (filter: getLocalCssStyleRulesProps = {}): CSSStyleRule[] => {
        const { cssRuleType = "CSSStyleRule", selectorText } = filter;
        const cssStyleRules = CssCustomProperties.listLocalCssRules().filter((rule) => {
            if (cssRuleType === "CSSStyleRule" && !CssCustomProperties.isCssStyleRule(rule)) {
                return false;
            }
            if (!!selectorText && !CssCustomProperties.matchesSelectorText(rule as CSSStyleRule, selectorText)) {
                return false;
            }
            return true;
        });
        return cssStyleRules as CSSStyleRule[];
    };

    /**
     * Return the property names of a style declaration.
     * The declaration is not iterated directly because it is not always an iterable object, e.g.
     * the declarations of style rules are not iterable in test environments using jsdom.
     */
    static listStyleDeclarationPropertyNames = (style: CSSStyleDeclaration): string[] => {
        const propertyNames = [] as string[];

        for (let i = 0; i < style.length; i++) {
            // `item()` is not available everywhere, the indexed getter is the more reliable one
            const propertyName = style[i] ?? style.item?.(i);
            if (propertyName) {
                propertyNames.push(propertyName);
            }
        }

        return propertyNames;
    };

    static listLocalCssStyleRuleProperties = (filter: getLocalCssStyleRulePropertiesProps = {}): string[][] => {
        const { propertyType = "all", ...otherFilters } = filter;
        return CssCustomProperties.listLocalCssStyleRules(otherFilters)
            .map((cssrule) => {
                const style = (cssrule as CSSStyleRule).style;
                return CssCustomProperties.listStyleDeclarationPropertyNames(style).map((propertyname) => {
                    return [propertyname.trim(), style.getPropertyValue(propertyname).trim()];
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

    /**
     * Return the element the values of custom properties can be read from.
     * `:root` and `html` are mapped to the root element of the document, for any other selector the
     * first matching element is used.
     * If nothing matches and the selector consists of class names only, then a temporary hidden
     * element is created; the second item of the returned tuple removes it again.
     */
    static targetElement = (selectorText: string = ":root"): [Element | undefined, (() => void) | undefined] => {
        if (typeof document === "undefined") {
            return [undefined, undefined];
        }

        if (rootSelectors.includes(selectorText.trim().toLowerCase())) {
            return [document.documentElement, undefined];
        }

        try {
            const existingElement = document.querySelector(selectorText);
            if (existingElement) {
                return [existingElement, undefined];
            }
        } catch {
            // selector cannot be used by the DOM API, we try to create a placeholder below
        }

        if (!classSelectorPattern.test(selectorText)) {
            return [undefined, undefined];
        }

        // we need an element inside the DOM, otherwise the browser does not calculate the values for us
        const placeholder = document.createElement("div");
        placeholder.classList.add(...selectorText.split(".").filter(Boolean));
        placeholder.setAttribute("style", "display: none");
        (document.body ?? document.documentElement).appendChild(placeholder);

        return [placeholder, () => placeholder.remove()];
    };

    /**
     * Return the names of all custom properties that apply to an element, they are read from its
     * computed style.
     * Inherited custom properties are part of the computed style, so the returned list also contains
     * the names of custom properties that were declared for one of the ancestors of the element.
     */
    static listElementCustomPropertyNames = (element: Element): string[] => {
        const documentView = element.ownerDocument?.defaultView;
        if (!documentView) {
            return [];
        }

        const computedStyle = documentView.getComputedStyle(element);
        const propertyNames = new Set<string>(
            CssCustomProperties.listStyleDeclarationPropertyNames(computedStyle).filter((propertyName) =>
                propertyName.startsWith("--"),
            ),
        );

        const typedOMElement = element as TypedOMElement;
        if (propertyNames.size === 0 && typeof typedOMElement.computedStyleMap === "function") {
            // Chromium before v141 does not enumerate custom properties in `getComputedStyle()`,
            // but they are available via the typed object model
            typedOMElement.computedStyleMap().forEach((_value, propertyName) => {
                if (propertyName.startsWith("--")) {
                    propertyNames.add(propertyName);
                }
            });
        }

        return [...propertyNames];
    };

    /**
     * Resolve the values of custom properties as they are applied to an element.
     * Properties without a value are removed, they do not apply to the element, e.g. because they
     * are only defined inside a currently not matching `@media` rule.
     */
    static resolveCustomPropertyValues = (element: Element, propertyNames: string[]): CustomPropertyEntry[] => {
        const documentView = element.ownerDocument?.defaultView;
        if (!documentView) {
            return [];
        }

        const computedStyle = documentView.getComputedStyle(element);

        return propertyNames
            .map((propertyName): CustomPropertyEntry => {
                return [propertyName, computedStyle.getPropertyValue(propertyName).trim()];
            })
            .filter(([, value]) => value !== "");
    };

    static listCustomProperties = (
        props: getCustomPropertiesProps = {},
    ): CustomPropertyEntry[] | Record<string, string> => {
        const {
            removeDashPrefix = true,
            returnObject = true,
            filterName = () => true,
            useComputedStyleFallback = false,
            ...filterProps
        } = props;

        // the CSSOM is used to get the names only, the cascade decides about the values
        const propertyNames = [
            ...new Set(
                CssCustomProperties.listLocalCssStyleRuleProperties({
                    ...filterProps,
                    propertyType: "custom",
                })
                    .map((declaration) => declaration[0])
                    .filter((propertyName) => filterName(propertyName)),
            ),
        ];

        const [element, removePlaceholder] = CssCustomProperties.targetElement(filterProps.selectorText);

        try {
            const namesToResolve =
                propertyNames.length === 0 && useComputedStyleFallback && element
                    ? CssCustomProperties.listElementCustomPropertyNames(element).filter((propertyName) =>
                          filterName(propertyName),
                      )
                    : propertyNames;

            const customProperties = (
                element ? CssCustomProperties.resolveCustomPropertyValues(element, namesToResolve) : []
            ).map(([propertyName, value]): CustomPropertyEntry => {
                return [removeDashPrefix ? propertyName.slice(2) : propertyName, value];
            });

            return returnObject
                ? (Object.fromEntries(customProperties) as Record<string, string>)
                : (customProperties as CustomPropertyEntry[]);
        } finally {
            removePlaceholder?.();
        }
    };
}
