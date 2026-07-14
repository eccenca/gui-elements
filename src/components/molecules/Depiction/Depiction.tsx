import React, { useCallback, useEffect, useRef } from "react";
import { cva } from "class-variance-authority";
import SVG from "react-inlinesvg";
import Color, { ColorLike } from "color";

import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";
import { BadgeProps } from "@/components/atoms/Badge/Badge";
import { IconProps } from "@/components/atoms/Icon/Icon";
import { TestIconProps } from "@/components/atoms/Icon/TestIcon";
import Tooltip, { TooltipProps } from "@/components/atoms/Tooltip/Tooltip";

import decideContrastColorValue from "@/common/utils/colorDecideContrastvalue";

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
    backgroundColor?: ColorLike | "light" | "dark";
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
     * Reduce opacity to let it appear as inactive.
     * Even if it is no form control element it could be used inside one.
     * Use this property if the `disabled` state there is not adapted automatically to the depiction.
     */
    disabled?: boolean;
    /**
     * Description of the depiction.
     */
    caption?: string | React.JSX.Element;
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
 * Tailwind recipe for the depiction tile (`.eccgui-depiction__image`), ported 1:1 from the former
 * `depiction.scss`. The `size` axis sets the tile *height* only (width follows the ratio, matching
 * the old height-only rules); `ratio` sets the aspect box; `resizing` maps to `object-fit`.
 *
 * Under the now-active Tailwind preflight (`img,video{max-width:100%;height:auto}`) the child image
 * needs explicit sizing, hence the base `[&_img]:size-full [&_svg]:size-full` (was the scss
 * `img,svg{width:100%;height:100%}`); `ratio="source"` relaxes it back to natural size via
 * `max-*-full`. The `[:disabled_&_...]` rules mirror the old `*:disabled &` ancestor dimming.
 */
const depictionImageVariants = cva(
    "max-h-full max-w-full overflow-hidden rounded-md [&_img]:size-full [&_svg]:size-full [:disabled_&_img]:opacity-50 [:disabled_&_svg:not(.eccgui-icon)]:opacity-50",
    {
        variants: {
            size: {
                tiny: "h-6",
                small: "h-10",
                medium: "h-16",
                large: "h-32",
                xlarge: "h-64",
                source: "h-auto",
            },
            resizing: {
                contain: "[&_img]:object-contain [&_svg]:object-contain",
                cover: "[&_img]:object-cover [&_svg]:object-cover",
                stretch: "[&_img]:object-fill [&_svg]:object-fill",
            },
            ratio: {
                "1:1": "aspect-square",
                source: "aspect-auto min-h-6 min-w-6 [&_img]:max-h-full [&_img]:max-w-full [&_svg]:max-h-full [&_svg]:max-w-full",
            },
            padding: {
                none: "",
                tiny: "p-[5%]",
                small: "p-[8%]",
                medium: "p-[13%]",
                large: "p-[21%]",
            },
        },
    }
);

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
    disabled,
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
        } catch {
            // eslint-disable-next-line no-console
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
        [resizing],
    );

    const inlineSvgCall = useCallback(
        (svgElement: SVGElement) => {
            if (svgElement) {
                updateSvgResizing(svgElement);
            }
        },
        [updateSvgResizing],
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
            className={cn(
                depictionImageVariants({ size, resizing, ratio, padding }),
                // `rounded` (fully rounded shape) overrides the base `rounded-md`; the old scss used
                // `border-radius: 0.5 * height` per size, i.e. a capsule/circle — `rounded-full` here.
                rounded && "rounded-full",
                border && "border border-border",
                // color tiles: `--color-dark`/`--color-light` seed the custom props that `--color-config`
                // (and the inline `styleDepictionColors` for custom colors) read back.
                backgroundColor === "dark" &&
                    "[--eccgui-depiction-background:var(--muted)] [--eccgui-depiction-color:var(--muted-foreground)]",
                backgroundColor === "light" &&
                    "[--eccgui-depiction-background:var(--background)] [--eccgui-depiction-color:var(--foreground)]",
                !!backgroundColor &&
                    "bg-[var(--eccgui-depiction-background,transparent)] text-[var(--eccgui-depiction-color,inherit)]",
                disabled && "opacity-50",
                // frozen `eccgui-*` classname contract — keep emitting exactly as before
                `${eccgui}-depiction__image`,
                `${eccgui}-depiction__image--${size}`,
                `${eccgui}-depiction__image--${resizing}-sizing`,
                `${eccgui}-depiction__image--ratio-${ratio.replace(":", "to")}`,
                (backgroundColor === "light" || backgroundColor === "dark") &&
                    `${eccgui}-depiction__image--color-${backgroundColor}`,
                !!backgroundColor && `${eccgui}-depiction__image--color-config`,
                border && `${eccgui}-depiction__image--hasborder`,
                rounded && `${eccgui}-depiction__image--roundedborder`,
                padding !== "none" && `${eccgui}-depiction__image--padding-${padding}`,
                disabled && `${eccgui}-depiction__image--disabled`
            )}
            style={styleDepictionColors as React.CSSProperties}
        >
            {depiction}
        </div>
    );

    return (
        <figure
            className={cn("relative inline-flex max-w-full print:[print-color-adjust:exact]", `${eccgui}-depiction`, className)}
            {...otherFigureProps}
        >
            {captionPosition === "tooltip" && !!caption ? (
                <Tooltip content={caption} size="medium" {...tooltipProps}>
                    {depictionContainer}
                </Tooltip>
            ) : (
                depictionContainer
            )}
            {!!caption && (
                <figcaption
                    // both `--none` and `--tooltip` captions are visually hidden off-screen (kept in the
                    // DOM for a11y/alt text); the visible caption, if any, is rendered via the Tooltip above.
                    className={cn(
                        "fixed left-[-5000rem]",
                        `${eccgui}-depiction__caption`,
                        `${eccgui}-depiction__caption--${captionPosition}`
                    )}
                >
                    {caption}
                </figcaption>
            )}
            {badge}
        </figure>
    );
}
