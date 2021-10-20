/*
    shows iframe and spinner as long as it is not loaded
*/

import React, { useState, useEffect } from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import {TestableComponent} from "../interfaces";
import Spinner from "../Spinner/Spinner";

export interface IframeProps extends TestableComponent {
    // addional class names
    className?: string;
    // <iframe> elements must have a unique title property
    title: string;
    // iframe source url
    src: string;
    // Set height that iframe should use, roughly based on viewport height
    useViewportHeight?: "quarter" | "third" | "half" | "full";
    // use full space that is provided by parent element (requires non-"static" position)
    useAvailableSpace?: boolean;
    // use haight calculated from iframe content
    useContentHeight?: boolean;
    // native (forwarded) properties of HTL iframe element
    htmlIframeProps?: Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, "title" | "className">
}

export const Iframe = React.forwardRef<HTMLIFrameElement, IframeProps>(({
    title,
    className = "",
    useViewportHeight,
    useAvailableSpace = false,
    useContentHeight = false,
    htmlIframeProps = {},
    ...otherReactProps
}: IframeProps, ref) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
    const newRef = React.useRef<HTMLIFrameElement>(null);
    useEffect(() => {
        const iframeRef = ref??newRef;
        if(iframeRef && "current" in iframeRef && iframeRef.current) {
            setContentHeight(iframeRef.current.contentWindow?.document?.body?.scrollHeight);
        }
    }, [ref]);
    const classNames = `${eccgui}-iframe` +
        (!!useViewportHeight ? ` ${eccgui}-iframe--${useViewportHeight}height` : "") +
        (!!useAvailableSpace ? ` ${eccgui}-iframe--useavailablespace` : "") +
        (className? ` ${className}` : "");
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
                {...htmlIframeProps}
                {...otherReactProps}
                onLoad={() => setIsLoaded(true)}
                style={{
                    ...(htmlIframeProps.style??{}),
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
