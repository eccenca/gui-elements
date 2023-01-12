/** Zero width invisible characters, i.e. they do not change the space between 2 other characters. */
const internalInvisibleZeroWidthCharacterCodePoints: InternalInvisibleCharacter[] = [
    { codePoint: 11, label: "Vertical Tabulation" },
    { codePoint: 173, label: "Soft hyphen" },
    { codePoint: 847, label: "Combining grapheme joiner" },
    { codePoint: 1564, label: "Arabic letter mark" },
    { codePoint: [6068, 6069], label: "Khmer vowel inherent" },
    { codePoint: [6155, 6158], label: "Mongolian special characters" },
    { codePoint: 8203, label: "Zero Width Space" },
    { codePoint: 8204, label: "Zero Width Non-Joiner" },
    { codePoint: 8205, label: "Zero Width Joiner" },
    { codePoint: 8206, label: "Left-To-Right Mark" },
    { codePoint: 8207, label: "Right-To-Left Mark" },
    { codePoint: [8234, 8238], label: "zero width character" },
    // Word joiner - Nominal Digit Shapes
    { codePoint: [8288, 8303], label: "zero width character" },
    { codePoint: [65024, 65039], label: "Variation selectors" },
    { codePoint: 65279, label: "Zero Width No-Break Space" },
    { codePoint: [65520, 65528], label: "Specials" },
    { codePoint: 65532, label: "Object Replacement Character" },
    { codePoint: [119155, 119162], label: "Invisible Musical Symbol" },
    { codePoint: [917504, 917631], label: "Tags" },
    { codePoint: [917760, 917999], label: "Variation Selectors" }
]

const toHex = (codepoint: number): string => codepoint.toString(16).toUpperCase()

/** All characters that are considered invisible zero-width characters that e.g. need to be handled in input fields. */
const invisibleZeroWidthCharacterCodePoints: InvisibleCharacter[] = internalInvisibleZeroWidthCharacterCodePoints.map(cp => {
    const create = (codePoint: number, label?: string) => {
        const hexString = toHex(codePoint)
        const unicodeHexRepresentation = `U+${hexString}`
        return {
            codePoint: codePoint,
            label: label ?? unicodeHexRepresentation,
            hexString,
            fullLabel: label ? `${label} (${unicodeHexRepresentation})` : unicodeHexRepresentation
        }
    }
    if(Array.isArray(cp.codePoint)) {
        const codePoints: InvisibleCharacter[] = []
        const [from, to] = cp.codePoint
        if(from < 0 || to < 0 || from > to) {
            throw new Error(`Invalid code point range specified: [${from}, ${to}]`)
        }
        for(let currentCp = from; currentCp <= to; currentCp++) {
            codePoints.push(create(currentCp, cp.label))
        }
        return codePoints
    } else {
        return create(cp.codePoint, cp.label)
    }
}).flat()

const createInvisibleZeroWidthCharacterCodePointsRegex = () => {
    return new RegExp(
        `([${
            invisibleZeroWidthCharacterCodePoints
                .map(cp => `\\u{${cp.hexString}}`)
                .join("")
        }])`,
        "ug"
    )
}

/** Map from codepoint to invisible character. */
const invisibleZeroWidthCharacterCodePointsMap: Map<number, InvisibleCharacter> = new Map(
    invisibleZeroWidthCharacterCodePoints.map(cp => [cp.codePoint, cp])
)

const clearStringFromInvisibleCharacters = (inputString: string): string => {
    const regex = createInvisibleZeroWidthCharacterCodePointsRegex()
    return inputString.replaceAll(regex, "")
}

interface InternalInvisibleCharacter {
    /** Code point or code point range (inclusive on both sides). */
    codePoint: number | [number, number],
    /** Human readable label for code point. */
    label?: string
}

type InvisibleCharacter = {
    /** Code point. */
    codePoint: number,
    /** Human readable label for code point. */
    label: string
    /** The hex representation of the code point, e.g. "200B" */
    hexString: string
    /** The label plus the hex value. */
    fullLabel: string
}

const invisibleZeroWidthCharacters = {
    codePoints: invisibleZeroWidthCharacterCodePoints,
    codePointMap: invisibleZeroWidthCharacterCodePointsMap,
    createRegex: createInvisibleZeroWidthCharacterCodePointsRegex,
    clearString: clearStringFromInvisibleCharacters
}

const moduleObject = {
    invisibleZeroWidthCharacters
}
export default moduleObject
