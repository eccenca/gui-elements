import React from "react";
import { renderToString } from "react-dom/server";
import * as ReactIs from "react-is";

import { TextReducerProps } from "./../../components/TextReducer/TextReducer";
import { DecodeHtmlEntitiesOptions, utils } from "./../";

export interface ReduceToTextFuncType {
    (
        /**
         *  Component or text to reduce HTML markup content to plain text.
         */
        input: React.ReactNode | React.ReactNode[] | string,
        options?: Pick<TextReducerProps, "maxNodes" | "maxLength" | "decodeHtmlEntities" | "decodeHtmlEntitiesOptions">
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

                if (ReactIs.isFragment(child)) return onlyText(child.props?.children);
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
        // we decode in pieces to some error tolerance even in strict mode
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
            // eslint-disable-next-line no-console
            console.warn(`${decodeErrors} parse error(s) for decodeHtmlEntities, return un-decoded text`, text);
        }
    }

    if (typeof maxLength === "number") {
        text = text.slice(0, maxLength);
    }

    return text.trim();
};
