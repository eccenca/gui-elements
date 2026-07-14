import React, { useEffect, useState } from "react";

import { cn } from "@/common/utils/cn";
import Spinner from "@/components/atoms/Spinner/Spinner";
import { TestableComponent } from "@/components/interfaces";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

/**
 * Viewport-relative iframe heights, each clearing the 56px application header (the former per-fraction
 * SCSS reduction of header - card spacing - button height is simplified to the full header height).
 */
const viewportHeightClassName: Record<NonNullable<IframeProps["useViewportHeight"]>, string> = {
    quarter: "h-[calc(25vh-56px)]",
    third: "h-[calc(33vh-56px)]",
    half: "h-[calc(50vh-56px)]",
    full: "h-[calc(100vh-56px)]",
};

export interface IframeProps extends TestableComponent {
    // additional class names
    className?: string;
    // <iframe> elements must have a unique title property
    title: string;
    // iframe source url
    src: string;
    // Set height that iframe should use, roughly based on viewport height
    useViewportHeight?: "quarter" | "third" | "half" | "full";
    // use full space that is provided by parent element (requires non-"static" position)
    useAvailableSpace?: boolean;
    /**
     * Use height calculated from iframe content.
     * Currently this only works when the iframe content is not changed after the onLoad event by lazy loading, etc.
     * It also takes not height changes into account that are based on resized viewport
     */
    useContentHeight?: boolean;
    // Set iframe background color, need to be a valid CSS color definition
    backgroundColor?: string;
    // native (forwarded) properties of HTML iframe element
    htmlIframeProps?: Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, "title" | "className" | "src">;
}

/**
 * Display iframe but shows a spinner as long as it is not loaded.
 */
export const Iframe = React.forwardRef<HTMLIFrameElement, IframeProps>(
    (
        {
            title,
            className = "",
            useViewportHeight,
            useAvailableSpace = false,
            useContentHeight = false,
            backgroundColor = "",
            htmlIframeProps = {},
            ...otherReactProps
        }: IframeProps,
        ref,
    ) => {
        const [isLoaded, setIsLoaded] = useState<boolean>(false);
        const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
        const newRef = React.useRef<HTMLIFrameElement>(null);
        useEffect(() => {
            const iframeRef = ref ?? newRef;
            if (iframeRef && "current" in iframeRef && iframeRef.current) {
                if (!!backgroundColor && isLoaded) {
                    const iframeDocStyle = iframeRef?.current?.contentDocument?.documentElement?.style;
                    const iframeBodyStyle = iframeRef?.current?.contentDocument?.body?.style;
                    if (iframeDocStyle && iframeBodyStyle) {
                        iframeDocStyle.backgroundColor = backgroundColor;
                        iframeBodyStyle.backgroundColor = backgroundColor;
                    }
                }
                setContentHeight(iframeRef.current.contentWindow?.document?.body?.scrollHeight);
            }
        }, [ref, isLoaded, backgroundColor]);
        const classNames = cn(
            `${eccgui}-iframe`,
            useViewportHeight &&
                cn(`${eccgui}-iframe--${useViewportHeight}height`, viewportHeightClassName[useViewportHeight]),
            // fill the positioned parent (requires a non-static ancestor, e.g. the relative card
            // content inside `IframeModal` — see the KEEP rule in iframe.scss)
            useAvailableSpace && `${eccgui}-iframe--useavailablespace absolute inset-0 h-auto w-auto`,
        );
        const { onLoad = () => {}, style, ...otherOriginalIframeProps } = htmlIframeProps;
        return (
            <div className={classNames}>
                {!isLoaded && <Spinner />}
                <iframe
                    // full width; fill the sized/available-space wrapper vertically
                    className={cn("w-full", (useViewportHeight || useAvailableSpace) && "h-full", className)}
                    ref={ref ?? newRef}
                    title={title}
                    {...otherOriginalIframeProps}
                    {...otherReactProps}
                    onLoad={(e) => {
                        setIsLoaded(true);
                        onLoad(e);
                    }}
                    style={{
                        ...(style ?? {}),
                        ...(!isLoaded
                            ? ({
                                  visibility: "hidden",
                                  position: "absolute",
                                  left: "-10000em",
                              } as React.CSSProperties)
                            : {}),
                        ...(useContentHeight && !!contentHeight
                            ? {
                                  height: `${contentHeight}px`,
                              }
                            : {}),
                    }}
                    scrolling={useContentHeight && !!contentHeight ? "no" : "yes"}
                />
            </div>
        );
    },
);

export default Iframe;
