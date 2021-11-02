import highlightSearchWordsPluginFactory from "@gui-elements/src/cmem/markdown/highlightSearchWords";
import {VFile} from "vfile";
import {Root, Parent, Element, Text} from "hast";

describe("Highlight search words reHype plugin", () => {
    it("should highlight search words", () => {
        const searchQuery = "abc xyz"
        const highlightSearchWordsPlugin = highlightSearchWordsPluginFactory(searchQuery)
        const highlightSearchWordTransformer = highlightSearchWordsPlugin()
        const textNode = (text: string): Text => ({type: "text", value: text})
        const markNode = (text: string): Element => ({type: "element", tagName: "mark", children: [textNode(text)]})
        const result = highlightSearchWordTransformer({
                type: "root",
                children: [
                    {
                        type: "element",
                        tagName: "p",
                        children: [textNode("Text with abc query words xyz.")]
                    }
                ]
            },
            new VFile(),
            () => {
            }
        );
        const rootChildren = (result as Root).children
        expect(rootChildren.length).toBe(1)
        expect((rootChildren[0] as Parent).children).toStrictEqual([
            textNode("Text with "),
            markNode("abc"),
            textNode(" query words "),
            markNode("xyz"),
            textNode(".")
        ])
    })
})
