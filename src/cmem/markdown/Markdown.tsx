import React from "react";
import ReactMarkdown from "react-markdown";
/**
 * Recreate the old type to provide support until next major
 */
import { PluggableList as PluggableListDeprecated } from "react-markdown-deprecated/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore: No declaration file for module (TODO: should be @ts-expect-error but GUI elements is used inside project with `noImplicitAny=false`)
import remarkTypograf from "@mavrin/remark-typograf";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import { remarkDefinitionList } from "remark-definition-list";
import remarkGfm from "remark-gfm";
import { PluggableList as PluggableListUnified } from "unified";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { HtmlContentBlock, HtmlContentBlockProps, TestableComponent } from "../../index";
type PluggableList = PluggableListUnified | PluggableListDeprecated;

export interface MarkdownProps extends TestableComponent {
    children: string;
    /**
     * Allow HTML as partial content, otherwise escape HTML tags.
     * Use with caution!
     */
    allowHtml?: boolean;
    /**
     * Return an object that only contains simple text without any HTML.
     */
    removeMarkup?: boolean;
    /**
     * If defined, only elements from this list will be rendered.
     * This overwrites the removeMarkup parameter if both are set.
     */
    allowedElements?: string[];
    /**
     * Do not wrap content in a `HtmlContentBlock` component.
     * This option is ignored if `htmlContentBlockProps` or `data-test-id` is given.
     */
    inheritBlock?: boolean;
    /**
     * Additional reHype plugins to execute.
     * @see https://github.com/remarkjs/react-markdown#architecture
     * @deprecated (v25) this property won't support `PluggableList` from "react-markdown/lib/react-markdown" with the next major version, only the one from `unified` will be supported then.
     */
    reHypePlugins?: PluggableList;
    /**
     * Name for browser target where links withing the Markdown content are opened.
     * Set to `false` to disable this feature.
     */
    linkTargetName?: false | string;
    /**
     * Configure the `HtmlContentBlock` component that is automatically used as wrapper for the parsed Markdown content.
     */
    htmlContentBlockProps?: Omit<HtmlContentBlockProps, "children" | "className" | "data-test-id">;
}

const configDefault = {
    /*
        Using React Markdown configuration
        @see https://github.com/remarkjs/react-markdown#api
    */
    // @see https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins
    remarkPlugins: [remarkGfm, remarkTypograf, remarkDefinitionList] as PluggableListUnified,
    // @see https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins
    rehypePlugins: [] as PluggableListUnified,
    allowedElements: [
        // default markdown
        "a",
        "blockquote",
        "code",
        "em",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hr",
        "img",
        "li",
        "ol",
        "p",
        "pre",
        "strong",
        "ul",
        // gfm (Github Flavoured Markdown) extensions
        "del",
        "input",
        "table",
        "tbody",
        "td",
        "th",
        "thead",
        "tr",
        // other stuff
        "mark",
        "dl",
        "dt",
        "dd",
    ],
    // remove all unwanted HTML markup
    unwrapDisallowed: true,
    // show escaped HTML
    skipHtml: false,
};

/** Renders a markdown string. */
export const Markdown = ({
    children,
    allowHtml = false,
    removeMarkup = false,
    inheritBlock = false,
    allowedElements,
    reHypePlugins,
    linkTargetName = "_mdref",
    htmlContentBlockProps,
    ...otherProps
}: MarkdownProps) => {
    const configHtmlExternalLinks = {
        rel: ["nofollow"],
        target: linkTargetName,
    };

    configDefault.rehypePlugins = configDefault.rehypePlugins.concat([[rehypeExternalLinks, configHtmlExternalLinks]]);

    const configHtml = allowHtml
        ? {
              rehypePlugins: [...configDefault.rehypePlugins].concat([rehypeRaw]),
              // switch from allowed list to disallowed list
              allowedElements: undefined,
              disallowedElements: ["applet", "script", "style", "link", "iframe", "form", "button"],
          }
        : {};

    const configTextOnly = removeMarkup
        ? {
              skipHtml: true,
              allowedElements: [],
              disallowedElements: undefined,
          }
        : {};

    const reactMarkdownProperties = {
        children: children.trim(),
        ...configDefault,
        ...configHtml,
        ...configTextOnly,
        components: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code(props: any) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { children, className, node, inline, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                    <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        codeTagProps={{
                            className: `${eccgui}-markdown__syntaxhighlighter`,
                        }}
                        children={String(children).replace(/\n$/, "")}
                        language={match[1]}
                    />
                ) : (
                    <code {...rest} className={className}>
                        {children}
                    </code>
                );
            },
        },
        allowedElements,
    };

    if (reHypePlugins) {
        reactMarkdownProperties.rehypePlugins = reactMarkdownProperties.rehypePlugins.concat(
            reHypePlugins as PluggableListUnified
        );
    }

    const markdownDisplay = <ReactMarkdown {...reactMarkdownProperties} />;
    return inheritBlock && !(otherProps["data-test-id"] || htmlContentBlockProps) ? (
        markdownDisplay
    ) : (
        <HtmlContentBlock
            {...htmlContentBlockProps}
            className={`${eccgui}-markdown__container`}
            data-test-id={otherProps["data-test-id"]}
        >
            {markdownDisplay}
        </HtmlContentBlock>
    );
};
