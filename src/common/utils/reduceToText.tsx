import React from "react";
import { renderToString } from "react-dom/server";
import * as ReactIs from "react-is";

import { DecodeHtmlEntitiesOptions, utils } from "./../";

export interface ReduceToTextOptions {
    /**
     * Maximum number of nodes that are used from the HTML content.
     * An HTML element with multiple sub elements is count as only 1 node.
     */
    maxNodes?: number;
    /**
     * Set maximum string length of returned content.
     */
    maxLength?: number;
    /**
     * If you transform HTML markup to text then the result could contain HTML entity encoded strings.
     * By enabling this option they are decoded back to it's original char.
     */
    decodeHtmlEntities?: boolean;
    /**
     * Set the options used to decode the HTML entities, if `decodeHtmlEntities` is enabled.
     * Internally we use `he` library, see their [documentation on decode options](https://www.npmjs.com/package/he#hedecodehtml-options).
     * If not set we use `{ isAttributeValue: true, strict: true }` as default value.
     */
    decodeHtmlEntitiesOptions?: DecodeHtmlEntitiesOptions;
}

export interface ReduceToTextFuncType {
    (
        /**
         *  Component or text to reduce HTML markup content to plain text.
         */
        input: React.ReactNode | React.ReactNode[] | string,
        options?: ReduceToTextOptions,
    ): string;
}

export const reduceToText: ReduceToTextFuncType = (input, options) => {
    const { maxNodes, maxLength, decodeHtmlEntities } = options || {};
    const content: React.ReactNode | React.ReactNode[] = input;
    let nodeCount = 0;

    const onlyText = (nodes: React.ReactNode | React.ReactNode[]): string => {
        if (typeof maxNodes !== "undefined" && nodeCount >= maxNodes) return "";

        return React.Children.toArray(nodes)
            .slice(0, maxNodes)
            .map((child) => {
                if (typeof maxNodes !== "undefined" && nodeCount >= maxNodes) return "";

                if (ReactIs.isFragment(child))
                    return onlyText((child as React.ReactElement<{ children?: React.ReactNode }>).props?.children);
                if (typeof child === "string" || typeof child === "number") {
                    nodeCount++;
                    return child.toString();
                }
                if (ReactIs.isElement(child)) {
                    nodeCount++;
                    return renderToString(<span>{child}</span>);
                }
                return "";
            })
            .join(" ");
    };

    let text = typeof content === "string" ? content : onlyText(content);

    // Basic HTML cleanup
    text = text.replace(/<[^\s][^>]*>/g, "").replace(/\n/g, " ");

    if (decodeHtmlEntities) {
        const decodeDefaultOptions = {
            isAttributeValue: true,
            strict: true,
        } as DecodeHtmlEntitiesOptions;
        let decodeErrors = 0;
        // we decode in pieces to apply some error tolerance even in strict mode
        text = text
            .split(" ")
            .map((value) => {
                try {
                    return utils.decodeHtmlEntities(value, {
                        ...decodeDefaultOptions,
                        ...options?.decodeHtmlEntitiesOptions,
                    });
                } catch {
                    decodeErrors++;
                    return value;
                }
            })
            .join(" ");
        if (decodeErrors > 0) {
            console.warn(`${decodeErrors} parse error(s) for decodeHtmlEntities, return un-decoded text`, text);
        }
    }

    if (typeof maxLength === "number") {
        text = text.slice(0, maxLength);
    }

    return text.trim();
};
