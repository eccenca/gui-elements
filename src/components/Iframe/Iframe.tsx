/*
    shows iframe and spinner as long as it is not loaded
*/

import React, { useState, useEffect } from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {TestableComponent} from "../interfaces";
import Spinner from "../Spinner/Spinner";

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
    htmlIframeProps?: Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, "title" | "className" | "src">
}

export const Iframe = React.forwardRef<HTMLIFrameElement, IframeProps>(({
    title,
    className = "",
    useViewportHeight,
    useAvailableSpace = false,
    useContentHeight = false,
    backgroundColor = "",
    htmlIframeProps = {},
    ...otherReactProps
}: IframeProps, ref) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
    const newRef = React.useRef<HTMLIFrameElement>(null);
    useEffect(() => {
        const iframeRef = ref??newRef;
        if(iframeRef && "current" in iframeRef && iframeRef.current) {
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
    }, [ref, isLoaded]);
    const classNames = `${eccgui}-iframe` +
        (!!useViewportHeight ? ` ${eccgui}-iframe--${useViewportHeight}height` : "") +
        (!!useAvailableSpace ? ` ${eccgui}-iframe--useavailablespace` : "") +
        (className? ` ${className}` : "");
    const { onLoad = (e: any)=>{}, style, ...otherOriginalIframeProps } = htmlIframeProps;
    return (
        <>
            {!isLoaded && (
                <div className={classNames}>
                    <Spinner />
                </div>
            )}
            <iframe
                ref={ref??newRef}
                title={title}
                className={classNames}
                {...otherOriginalIframeProps}
                {...otherReactProps}
                onLoad={(e) => { setIsLoaded(true); onLoad(e); }}
                style={{
                    ...(style??{}),
                    ...(!isLoaded ? {
                        visibility: "hidden",
                        position: "absolute",
                        left: "-10000em",
                    } as React.CSSProperties : {}),
                    ...((useContentHeight && !!contentHeight) ? {
                        height: `${contentHeight}px`,
                    } : {})
                }}
                scrolling={(useContentHeight && !!contentHeight) ? "no" : "yes"}
            />
        </>
    );
});
