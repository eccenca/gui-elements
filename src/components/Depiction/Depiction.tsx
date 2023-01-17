import React, { useRef, useEffect, useCallback, useState } from "react";
import Color from "color";
import SVG from 'react-inlinesvg';
import { BadgeProps } from "../Badge/Badge";
import { IconProps } from "../Icon/Icon";
import Tooltip, { TooltipProps } from "../Tooltip/Tooltip";
import decideContrastColorValue from "./../../common/utils/colorDecideContrastvalue";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface DepictionProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Image that should be used as depiction.
     */
    image: React.ReactElement<IconProps | React.ImgHTMLAttributes<HTMLImageElement> | React.SVGProps<SVGSVGElement>>;
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
    badge?: React.ReactElement<BadgeProps>,
}

/**
 * Display a graphical representation and attache a caption or a badge to it.
 */
export function Depiction({
    className = "",
    image,
    forceInlineSvg = false,
    size="medium",
    resizing="cover",
    ratio="source",
    caption,
    captionPosition="none",
    backgroundColor,
    border,
    rounded,
    badge,
    tooltipProps,
    ...otherFigureProps
}: DepictionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    /*
    Looks like we cannot use the ref here because when useEffect is called the SVG element is not available through the DOM.
    It is also not possible to overcome this by useCallback because this is triggered before the element really has rendered.
    Using a workaround by combining useCallback and useState seems to be the only way it works atm.

    const inlineSvgRef = useRef<SVGElement>(null);
    useEffect(() => {
        console.log("inline svg", inlineSvgRef);
        const svgElement = containerRef.current!.getElementsByTagName("svg");
        if (svgElement.length > 0) {
            updateSvgResizing(svgElement[0], resizing);
        }
    }, [resizing, inlineSvgRef]);
    */
    const [inlineSvgCreated, setInlineSvgCreated] = useState<boolean>(false);
    const inlineSvgCall = useCallback((_node) => {
        setInlineSvgCreated(true);
    }, []);

    useEffect(() => {
        if (!!backgroundColor && backgroundColor !== "light" && backgroundColor !== "dark") {
            let color = Color("#ffffff")
            try {
                color = Color(backgroundColor);
            } catch(ex) {
                console.warn("Received invalid background color for depiction: " + backgroundColor)
            }

            containerRef.current!.style.setProperty(`--${eccgui}-depiction-background`, color.rgb().toString());
            containerRef.current!.style.setProperty(`--${eccgui}-depiction-color`, decideContrastColorValue({testColor: color}));
        }
    }, [backgroundColor, containerRef]);

    const updateSvgResizing = (el: SVGSVGElement, resizing: "cover" | "stretch" | "contain") => {
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
    }

    useEffect(() => {
        const svgElement = containerRef.current!.getElementsByTagName("svg");
        if (svgElement.length > 0) {
            updateSvgResizing(svgElement[0], resizing);
        }
    }, [resizing, containerRef, inlineSvgCreated]);

    let depiction = image;
    if (
        forceInlineSvg &&
        image.type === "img" &&
        "src" in image.props &&
        !!image.props.src &&
        image.props.src.startsWith("data:image/svg+xml")
    ) {
        depiction = (
            <SVG
                src={image.props.src}
                innerRef={inlineSvgCall}
            >
                {image}
            </SVG>
        )
    }

    const depictionContainer = (
        <div
            ref={containerRef}
            className={
                `${eccgui}-depiction__image` +
                ` ${eccgui}-depiction__image--${size}` +
                ` ${eccgui}-depiction__image--${resizing}-sizing` +
                ` ${eccgui}-depiction__image--ratio-${ratio.replace(":", "to")}` +
                (backgroundColor === "light" || backgroundColor === "dark" ? ` ${eccgui}-depiction__image--color-${backgroundColor}` : '') +
                (!!backgroundColor ? ` ${eccgui}-depiction__image--color-config` : '') +
                (border ? ` ${eccgui}-depiction__image--hasborder` : '') +
                (rounded ? ` ${eccgui}-depiction__image--roundedborder` : '')
            }
        >
            {depiction}
        </div>
    );

    return (
        <figure
            className={
                `${eccgui}-depiction` +
                (className ? ` ${className}` : '')
            }
            {...otherFigureProps}
        >
            { captionPosition === "tooltip" && !!caption ? (
                <Tooltip content={caption} size="medium" {...tooltipProps}>{depictionContainer}</Tooltip>
            ) : (
                depictionContainer
            )}
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
            {badge}
        </figure>
    );
}
