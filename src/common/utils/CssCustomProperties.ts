/**
 * Read CSS custom properties from the DOM.
 *
 * We do not collect them from the CSSOM (`document.styleSheets`) on purpose:
 * declarations can be nested inside grouping rules (`@layer`, `@media`, `@supports`, `@container`),
 * they can sit in cross origin stylesheets that must not be read at all, and their document order
 * does not represent the cascade anymore (unlayered declarations win over layered ones).
 * Reading the computed style of an element instead always returns the values the browser really
 * applies, including already resolved `var()` references.
 */

type CustomPropertyEntry = [string, string];

/** Element that supports the CSS typed object model, we only need to iterate over the property names. */
type TypedOMElement = Element & {
    computedStyleMap?: () => { forEach: (callback: (value: unknown, propertyName: string) => void) => void };
};

const rootSelectors = [":root", "html", ":root:root"];
const classSelectorPattern = /^(?:\.-?[_a-zA-Z][\w-]*)+$/;

interface getCustomPropertiesProps {
    /**
     * Selector of the element the custom properties are read from.
     * `:root` and `html` are mapped to the root element of the document.
     * For any other selector the first matching element is used, if nothing matches and the
     * selector consists of class names only, then a temporary hidden element is created.
     */
    selectorText?: string;
    /** Only return custom properties whose name (including the `--` prefix) passes this test. */
    filterName?: (name: string) => boolean;
    /** Remove the leading `--` from the returned property names. */
    removeDashPrefix?: boolean;
    /** Return an object instead of a list of name and value pairs. */
    returnObject?: boolean;
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
        // in case of performance issues other cache strategies could be also tested
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

    /**
     * Return the element the custom properties of a selector can be read from.
     * The second item of the returned tuple removes a temporarily created element again.
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

    static listElementCustomProperties = (element: Element): CustomPropertyEntry[] => {
        const documentView = element.ownerDocument?.defaultView;
        if (!documentView) {
            return [];
        }

        const computedStyle = documentView.getComputedStyle(element);
        const propertyNames = new Set<string>();

        for (let i = 0; i < computedStyle.length; i++) {
            const propertyName = computedStyle.item(i);
            if (propertyName.startsWith("--")) {
                propertyNames.add(propertyName);
            }
        }

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

        return [...propertyNames].map((propertyName) => [
            propertyName,
            computedStyle.getPropertyValue(propertyName).trim(),
        ]);
    };

    static listCustomProperties = (
        props: getCustomPropertiesProps = {},
    ): CustomPropertyEntry[] | Record<string, string> => {
        const { selectorText = ":root", removeDashPrefix = true, returnObject = true, filterName = () => true } = props;

        const [element, removePlaceholder] = CssCustomProperties.targetElement(selectorText);

        try {
            const customProperties = (element ? CssCustomProperties.listElementCustomProperties(element) : [])
                .filter(([propertyName]) => filterName(propertyName))
                .map(([propertyName, value]): CustomPropertyEntry => {
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
