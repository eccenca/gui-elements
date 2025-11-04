import React from "react";
import { renderToString } from "react-dom/server";
import * as ReactIs from "react-is";

export function reduceToText(
    input: React.ReactNode | React.ReactNode[] | string,
    options?: { maxNodes?: number; maxLength?: number; markdown?: boolean }
): string {
    const { maxNodes, maxLength, markdown } = options || {};
    let content: React.ReactNode | React.ReactNode[] = input;
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

    let text =
        typeof content === "string" ? content : onlyText(content);

    // Basic HTML cleanup
    text = text.replace(/<[^\s][^>]*>/g, "").replace(/\n/g, " ");

    // Optional Markdown simplification
    if (markdown) {
        text = text
            // bold / italic
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/__(.*?)__/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/_(.*?)_/g, "$1")
            // inline code
            .replace(/`([^`]*)`/g, "$1")
            // links: [text](url) → text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            // headings (# Title)
            .replace(/^#+\s*/gm, "")
            // lists
            .replace(/^\s*[-*+]\s+/gm, "")
            // blockquotes
            .replace(/^\s*>\s*/gm, "")
            // images ![alt](url) → alt
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
    }

    if (typeof maxLength === "number") {
        text = text.slice(0, maxLength);
    }

    return text.trim();
}
