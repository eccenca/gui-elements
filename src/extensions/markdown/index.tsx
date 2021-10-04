import ReactMarkdown from "react-markdown";
import { PluggableList } from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";
import React from "react";

interface MarkdownParserProps {
    children: string;
    // allow HTML as partial content, otherwise escape HTML tags (pls use with caution)
    allowHtml?: boolean;
    // return a object that only contains simple text without any HTML
    removeMarkup?: boolean;
}

const configDefault = {
    /*
        Using React Markdown configuration
        @see https://github.com/remarkjs/react-markdown#api
    */
    // @see https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins
    remarkPlugins: [] as PluggableList,
    // @see https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins
    rehypePlugins: [] as PluggableList,
    allowedElements: [
        // default markdown
        "a", "blockquote", "code", "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "li", "ol", "p", "pre", "strong", "ul",
        // gfm (Github Flavoured Markdown) extensions
        "del", "input", "table", "tbody", "td", "th", "thead", "tr"
    ],
    // remove all unwanted HTML markup
    unwrapDisallowed: true,
    // show escaped HTML
    skipHtml: false,
}

export const MarkdownParser = ({
    children,
    allowHtml = false,
    removeMarkup = false
}: MarkdownParserProps) => {

    const configHtml = allowHtml ? {
        rehypePlugins: configDefault.rehypePlugins?.concat([rehypeRaw]),
        // switch from allowed list to disallowed list
        allowedElements: undefined,
        disallowedElements: [ "applet", "script", "style", "link", "iframe", "form", "button" ],
    } : { };

    const configTextOnly = removeMarkup ? {
        skipHtml: true,
        allowedElements: [],
        disallowedElements: undefined,
    } : { };

    const reactMarkdownProperties = {
        children: children.trim(),
        ...configDefault,
        ...configHtml,
        ...configTextOnly,
    };

    return <ReactMarkdown {...reactMarkdownProperties} />
}
