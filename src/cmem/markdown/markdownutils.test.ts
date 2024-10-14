import utils from "./markdown.utils";

describe("Markdown utils", () => {
    it("should extract named anchors from the Markdown", () => {
        const namedAnchors = utils.extractNamedAnchors(
            '# Header\n\nsome text\n\n## <a  id="anchor1" ></a> point 1\n\n## <a id="anchor2"></a> point 2'
        );
        expect(namedAnchors).toStrictEqual(["anchor1", "anchor2"]);
    });

    it("should not extract named anchors from the Markdown that are not following the expected format", () => {
        const namedAnchors = utils.extractNamedAnchors(
            '# <a id="anchor" href="http://">link text</a> \n\n## <a name="test" id="anchor2"></a> point 2'
        );
        expect(namedAnchors).toStrictEqual([]);
    });
});
