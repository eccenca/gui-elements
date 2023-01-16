import React from "react";
// import { IconProps } from "../Icon/Icon";
// import Color from "color";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface DepictionProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Image that should be used as depiction.
     */
    image: HTMLImageElement; // | React.ReactElement<IconProps>
    /**
     * In case you use an SVG encoded as a Base64 data URL in an image, then it is transformed to a real SVG element.
     */
    // forceRealSvg?: boolean;
    /**
     * Sets the height of the depiction, not the dimension (width x height).
     */
    size?: "tiny" | "small" | "medium" | "large" | "xlarge" | "source";
    /**
     * Resizing strategy for image to match the given ratio.
     * * contain: image is fully visible in the depiction
     * * cover: the image fully covers the depition area but it may displayed only partially
     * * stretch: image is streched to fill the depiction area
     */
    resizing?: "contain" | "cover" | "stretch";
    /**
     * Aspect ration of the depiction.
     */
    ratio?: "1:1" | "source"; // | "3:2" | "5:4" | "16:9"
    /**
     * Use a fully rounded shape on the depiction edges.
     * Combined with `ratio="1:1"` its displayed within a circular shape.
     */
    // rounded?: boolean;
    /**
     * Color that is used for the depiction background.
     * This may be important if you use PNG, SVG or other image types that can have transparent background areas.
     */
    // backgroundColor?: Color | string | "light" | "dark";
    /**
     * The depiction is displayed with a border around it.
     */
    // border?: boolean;
    /**
     * Description of the depiction.
     */
    caption?: string | JSX.Element;
    /**
     * How is the caption displayed.
     */
    captionPosition?: "none"; // | "htmltitle"; // | "tooltip";
}

/**
 *
 */
export function Depiction({
    className = "",
    image,
    size="medium",
    resizing="cover",
    ratio="source",
    caption,
    captionPosition="none",
    // rounded,
}: DepictionProps) {
    return (
        <figure
            className={
                `${eccgui}-depiction` +
                (className ? ` ${className}` : '')
            }
        >
            <div
                className={
                    `${eccgui}-depiction__image` +
                    ` ${eccgui}-depiction__image--${size}` +
                    ` ${eccgui}-depiction__image--${resizing}-sizing` +
                    ` ${eccgui}-depiction__image--ratio-${ratio.replace(":", "to")}` /*+
                    (rounded ? ` ${eccgui}-depiction__image--${rounded}` : '')*/
                }
            >
                {image}
            </div>
            {!!caption && (
                <figcaption
                    className={
                        `${eccgui}-depiction__caption` +
                        ` ${eccgui}-depiction__caption--${captionPosition}`
                    }
                >
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
