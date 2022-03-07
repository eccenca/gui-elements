import React from "react";
import SimpleDialog, { SimpleDialogProps } from "../Dialog/SimpleDialog";
import IconButton from "../Icon/IconButton";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { Iframe, IframeProps } from "./Iframe";

export interface IframeModalProps extends Omit<SimpleDialogProps, "children"> {
    // The title of the dialog
    title: string;
    // iframe source url
    src: string;
    // Dialog is initailly displayed in fullscreen size
    startFullscreen?: boolean;
    // Forward properties to Iframe component
    compIframeProps?: Omit<IframeProps, "title" | "src" | "htmlIframeProps"> & React.RefAttributes<HTMLIFrameElement>;
    // native (forwarded) properties of HTL iframe element
    htmlIframeProps?: Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, "title" | "className" | "src">
}

/** Modal that contains an iframe and supports full screen mode. */
export function IframeModal({
    title,
    src,
    className="",
    startFullscreen = false,
    compIframeProps = {},
    htmlIframeProps = {},
    headerOptions,
    size = "large",
    ...otherSimpleDialogProps
}: IframeModalProps) {
    const [displayFullscreen, setDisplayFullscreen] = React.useState<boolean>(startFullscreen);
    const {
        useViewportHeight,
        useAvailableSpace,
        useContentHeight,
        ref,
        ...otherCompIframeProps
    } = compIframeProps;
    const internalRef = React.useRef<HTMLIFrameElement>(null);
    const iframeRef = ref ?? internalRef;

    return (
        <SimpleDialog
            hasBorder
            title={title}
            headerOptions={(
                <>
                    <IconButton
                        name={displayFullscreen ? "toggler-minimize" : "toggler-maximize"}
                        onClick={()=>setDisplayFullscreen(!displayFullscreen)}
                    />
                    <>
                        {headerOptions}
                    </>
                </>
            )}
            className={
                `${eccgui}-iframemodal` +
                (className ? ` ${className}` : "")
            }
            size={displayFullscreen ? "fullscreen" : size}
            {...otherSimpleDialogProps}
        >
            <Iframe
                title={title}
                src={src}
                useAvailableSpace={(!useViewportHeight && !useContentHeight) ? true : useAvailableSpace}
                useContentHeight={useContentHeight}
                useViewportHeight={useViewportHeight}
                htmlIframeProps={htmlIframeProps}
                {...otherCompIframeProps}
                ref={ref??iframeRef}
            />
        </SimpleDialog>
    )
}
