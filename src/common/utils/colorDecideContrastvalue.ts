import Color from "color";

export interface decideContrastColorValueProps {
    // The color that is used to test if it need a light or dark color as contrast value.
    testColor: Color | string;
    // the light color that can be used on a dark color
    lightColor?: Color | string;
    // the dark color that can be used on a light color
    darkColor?: Color | string;
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
