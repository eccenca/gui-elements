import { Content, Parent, Root, Text } from "hast";
import { Transformer } from "unified";
import { Node } from "unist";

import { highlighterUtils } from "../../components/Typography/Highlighter";

const highlightSearchWordsPluginFactoryFn = (searchQuery: string | undefined) => {
    const searchStringParts = searchQuery ? highlighterUtils.extractSearchWords(searchQuery) : [];
    const multiWordRegex = highlighterUtils.createMultiWordRegex(searchStringParts);
    const createTextNode = (text: string): Text => ({ type: "text", value: text });

    // Highlight a text node by returning an array of text and mark elements
    const highlightTextNode = (textNode: Text): Content[] => {
        if (searchStringParts.length === 0) {
            return [textNode];
        }
        const result: Content[] = [];

        const text = textNode.value;
        let offset = 0;
        // loop through matches and add unmatched and matched parts to result array
        let matchArray = multiWordRegex.exec(text);
        while (matchArray !== null) {
            result.push(createTextNode(text.slice(offset, matchArray.index)));
            result.push({ type: "element", tagName: "mark", children: [createTextNode(matchArray[0])] });
            offset = multiWordRegex.lastIndex;
            matchArray = multiWordRegex.exec(text);
        }
        // Add remaining unmatched string
        result.push(createTextNode(text.slice(offset)));
        return result;
    };

    // Upper level highlight function
    const highlightRootNode = (node: Root): Root => highlightParentNode(node);

    // Highlight function to be called on Parent nodes
    const highlightParentNode = <T extends Parent>(parentNode: T): T => {
        const newChildren: Content[] = [];
        parentNode.children.forEach((child) => {
            const highlightedChild = highlightTextNodes(child);
            if (Array.isArray(highlightedChild)) {
                newChildren.push(...(highlightedChild as Content[]));
            } else {
                newChildren.push(highlightedChild as Content);
            }
        });
        return { ...parentNode, children: newChildren } as T;
    };

    // Highlight function to be called on generic inner nodes
    const highlightTextNodes = (node: Node): Node | Node[] => {
        if (node.type === "text") {
            return highlightTextNode(node as Text);
        } else {
            if ((node as Parent).children) {
                return highlightParentNode(node as Parent);
            } else {
                return node;
            }
        }
    };
    return function highlightSearchWords(): Transformer<Root, Root> {
        return (input: Root) => highlightRootNode(input);
    };
};

/**
 * Creates a react-markdown reHype plugin that marks text based on a multi-word search query.
 * @deprecated moved to `markdownUtils.highlightSearchWordsPluginFactory`
 */
const highlightSearchWordsPluginFactory = highlightSearchWordsPluginFactoryFn;

export default highlightSearchWordsPluginFactory;

export const markdownUtils = {
    highlightSearchWordsPluginFactory: highlightSearchWordsPluginFactoryFn,
};
