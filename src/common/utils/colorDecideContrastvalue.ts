import Color from "color";

export type colorValue = Color | string;

export interface decideContrastColorValueProps {
    // The color that is used to test if it need a light or dark color as contrast value.
    testColor: colorValue;
    // the light color that can be used on a dark color
    lightColor?: colorValue;
    // the dark color that can be used on a light color
    darkColor?: colorValue;
}

const decideContrastColorValue = ({
    testColor,
    lightColor = "#fff",
    darkColor = "#000"
}: decideContrastColorValueProps): string => {
    let contrastColor = "";
    try {
        contrastColor = Color(testColor).isLight() ? Color(darkColor).rgb().toString() : Color(lightColor).rgb().toString();
    } catch(ex) {
        console.warn("Received invalid colors", {testColor, lightColor, darkColor});
    }
    return contrastColor;
}

export default decideContrastColorValue;
