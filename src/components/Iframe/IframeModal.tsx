import React from "react";
import SimpleDialog, { ISimpleDialogProps } from "../Dialog/SimpleDialog";
import IconButton from "../Icon/IconButton";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { Iframe, IframeProps } from "./Iframe";

export interface IframeModalProps extends Omit<ISimpleDialogProps, "children"> {
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

export function IframeModal({
    title,
    src,
    className="",
    startFullscreen = false,
    compIframeProps = {},
    htmlIframeProps = {},
    headerOptions,
    size = "large",
    ...otherDialogPRops
}: IframeModalProps) {
    const [displayFullscreen, setDisplayFullscreen] = React.useState<boolean>(startFullscreen);
    const {
        useViewportHeight,
        useAvailableSpace,
        useContentHeight,
        ref,
        ...otherCompIframeProps
    } = compIframeProps;
    const iframeRef = ref??React.useRef<HTMLIFrameElement>(null);

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
            {...otherDialogPRops}
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
