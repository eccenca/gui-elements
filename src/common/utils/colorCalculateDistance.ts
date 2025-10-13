import Color from "color";

export type colorValue = Color | string;

export interface colorCalculateDistanceProps {
    // Color used to calculate distance to other color.
    color1: colorValue;
    // Other color used to calculate distance to color.
    color2: colorValue;
}

/**
 * Calculates the distance between 2 colors.
 * To keep it simple the CIE76 formula is used.
 * @see https://en.wikipedia.org/wiki/Color_difference#CIE76
 */
export const colorCalculateDistance = ({ color1, color2 }: colorCalculateDistanceProps): number | null => {
    let colorDistance: number | null = null;
    try {
        const lab1 = Color(color1).lab();
        const lab2 = Color(color2).lab();
        colorDistance = ((lab1.l() - lab2.l()) ** 2 + (lab1.a() - lab2.a()) ** 2 + (lab1.b() - lab2.b()) ** 2) ** 0.5;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("Received invalid colors", { color1, color2, error });
    }
    return colorDistance;
};
