import React, { useCallback, useEffect, useRef } from "react";
import SVG from "react-inlinesvg";
import Color from "color";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { BadgeProps } from "../Badge/Badge";
import { IconProps } from "../Icon/Icon";
import { TestIconProps } from "../Icon/TestIcon";
import Tooltip, { TooltipProps } from "../Tooltip/Tooltip";

import decideContrastColorValue from "./../../common/utils/colorDecideContrastvalue";

export interface DepictionProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Image that should be used as depiction.
     */
    image: React.ReactElement<
        IconProps | TestIconProps | React.ImgHTMLAttributes<HTMLImageElement> | React.SVGProps<SVGSVGElement>
    >;
    /**
     * In case you use an SVG encoded as a data URL in the `<img />` element, then it is transformed to a inline SVG inside the DOM tree.
     * Should be work with Base64 and URL encoded data URIs.
     */
    forceInlineSvg?: boolean;
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
    rounded?: boolean;
    /**
     * Color that is used for the depiction background.
     * This may be important if you use PNG, SVG or other image types that can have transparent background areas.
     */
    backgroundColor?: Color | string | "light" | "dark";
    /**
     * The depiction is displayed with a border around it.
     */
    border?: boolean;
    /**
     * Add padding around the image inside the depiction.
     * The amount of padding is defined relative to the depiction size, so a small padding on a small depiction is displayed smaller than a small padding on a large depiction.
     */
    padding?: "none" | "tiny" | "small" | "medium" | "large";
    /**
     * Description of the depiction.
     */
    caption?: string | JSX.Element;
    /**
     * How is the caption displayed.
     */
    captionPosition?: "none" | "tooltip";
    /**
     * In case of `captionPosition="tooltip"` this can be used to set the properties of the Tooltip element.
     */
    tooltipProps?: TooltipProps;
    /**
     * Attach a `<Badge />` element to the depiction.
     */
    badge?: React.ReactElement<BadgeProps>;
}

/**
 * Display a graphical representation and attache a caption or a badge to it.
 */
export function Depiction({
    className = "",
    image,
    forceInlineSvg = false,
    size = "medium",
    resizing = "cover",
    ratio = "source",
    caption,
    captionPosition = "none",
    backgroundColor,
    border,
    rounded,
    padding = "none",
    badge,
    tooltipProps,
    ...otherFigureProps
}: DepictionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    let styleDepictionColors = Object.create(null);
    if (!!backgroundColor && backgroundColor !== "light" && backgroundColor !== "dark") {
        try {
            const color = Color(backgroundColor);
            styleDepictionColors = {
                [`--${eccgui}-depiction-background`]: color.rgb().toString(),
                [`--${eccgui}-depiction-color`]: decideContrastColorValue({ testColor: color }),
            };
        } catch (ex) {
            console.warn("Received invalid background color for depiction: " + backgroundColor);
        }
    }

    const updateSvgResizing = React.useCallback(
        (el: SVGElement) => {
            let preserveAspectRatio = "";
            switch (resizing) {
                case "cover":
                    preserveAspectRatio = "xMidYMid slice";
                    break;
                case "stretch":
                    preserveAspectRatio = "none";
                    break;
            }
            el.setAttribute("preserveAspectRatio", preserveAspectRatio);
        },
        [resizing]
    );

    const inlineSvgCall = useCallback(
        (svgElement: SVGElement) => {
            if (svgElement) {
                updateSvgResizing(svgElement);
            }
        },
        [updateSvgResizing]
    );

    useEffect(() => {
        // Resize element after every render
        const svgElement = containerRef.current!.getElementsByTagName("svg");
        if (svgElement.length > 0) {
            updateSvgResizing(svgElement[0]);
        }
    });

    let depiction = image;
    if (
        forceInlineSvg &&
        image.type === "img" &&
        "src" in image.props &&
        !!image.props.src &&
        image.props.src.startsWith("data:image/svg+xml")
    ) {
        depiction = (
            <SVG src={image.props.src} innerRef={inlineSvgCall}>
                {image}
            </SVG>
        );
    }

    const depictionContainer = (
        <div
            ref={containerRef}
            className={
                `${eccgui}-depiction__image` +
                ` ${eccgui}-depiction__image--${size}` +
                ` ${eccgui}-depiction__image--${resizing}-sizing` +
                ` ${eccgui}-depiction__image--ratio-${ratio.replace(":", "to")}` +
                (backgroundColor === "light" || backgroundColor === "dark"
                    ? ` ${eccgui}-depiction__image--color-${backgroundColor}`
                    : "") +
                (backgroundColor ? ` ${eccgui}-depiction__image--color-config` : "") +
                (border ? ` ${eccgui}-depiction__image--hasborder` : "") +
                (rounded ? ` ${eccgui}-depiction__image--roundedborder` : "") +
                (padding && padding !== "none" ? ` ${eccgui}-depiction__image--padding-${padding}` : "")
            }
            style={styleDepictionColors as React.CSSProperties}
        >
            {depiction}
        </div>
    );

    return (
        <figure className={`${eccgui}-depiction` + (className ? ` ${className}` : "")} {...otherFigureProps}>
            {captionPosition === "tooltip" && !!caption ? (
                <Tooltip content={caption} size="medium" {...tooltipProps}>
                    {depictionContainer}
                </Tooltip>
            ) : (
                depictionContainer
            )}
            {!!caption && (
                <figcaption
                    className={`${eccgui}-depiction__caption` + ` ${eccgui}-depiction__caption--${captionPosition}`}
                >
                    {caption}
                </figcaption>
            )}
            {badge}
        </figure>
    );
}
