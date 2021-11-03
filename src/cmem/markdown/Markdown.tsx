import ReactMarkdown from "react-markdown";
import {PluggableList} from "react-markdown/lib/react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkTypograf from "@mavrin/remark-typograf";
import {remarkDefinitionList} from 'remark-definition-list';
import React from "react";
import { HtmlContentBlock } from "../../../index";

interface MarkdownParserProps {
    children: string;
    // allow HTML as partial content, otherwise escape HTML tags (pls use with caution)
    allowHtml?: boolean;
    // return an object that only contains simple text without any HTML
    removeMarkup?: boolean;
    // If defined, only elements from this list will be rendered. This overwrites the removeMarkup parameter if both are set.
    allowedElements?: string[]
    /** Additional reHype plugins to execute.
     * @see https://github.com/remarkjs/react-markdown#architecture
     */
    reHypePlugins?: PluggableList
}

const configDefault = {
    /*
        Using React Markdown configuration
        @see https://github.com/remarkjs/react-markdown#api
    */
    // @see https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins
    remarkPlugins: [remarkGfm, remarkTypograf, remarkDefinitionList] as PluggableList,
    // @see https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins
    rehypePlugins: [] as PluggableList,
    allowedElements: [
        // default markdown
        "a", "blockquote", "code", "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "li", "ol", "p", "pre", "strong", "ul",
        // gfm (Github Flavoured Markdown) extensions
        "del", "input", "table", "tbody", "td", "th", "thead", "tr",
        // other stuff
        "mark"
    ],
    // remove all unwanted HTML markup
    unwrapDisallowed: true,
    // show escaped HTML
    skipHtml: false,
}

/** Renders a markdown string. */
export const Markdown = ({
                             children,
                             allowHtml = false,
                             removeMarkup = false,
                             allowedElements,
                             reHypePlugins
                         }: MarkdownParserProps) => {

    const configHtml = allowHtml ? {
        rehypePlugins: [...configDefault.rehypePlugins].concat([rehypeRaw]),
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
    allowedElements && (reactMarkdownProperties.allowedElements = allowedElements)
    reHypePlugins && reHypePlugins.forEach(plugin => reactMarkdownProperties.rehypePlugins = [...reactMarkdownProperties.rehypePlugins, plugin])

    return (
        <HtmlContentBlock>
            <ReactMarkdown {...reactMarkdownProperties} />
        </HtmlContentBlock>
    );
}
