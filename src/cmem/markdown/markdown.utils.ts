/** Extracts the values of all named anchors used in the Markdown string, i.e. of the form <mark name="<value>"></mark>. */
const extractNamedAnchors = (markdown: string): string[] => {
    const regex = new RegExp("<a\\s+id=\"([^\"]+)\"\\s*>[^<]*</a>", "g")
    const namedAnchors: string[] = []

    let results = regex.exec(markdown)
    while(results !== null) {
        namedAnchors.push(results[1]);
        results = regex.exec(markdown)
    }
    return namedAnchors
}

const utils = {
    extractNamedAnchors
}

export default utils
