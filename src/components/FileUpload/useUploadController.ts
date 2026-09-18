import React from "react";

import { FileUploadBaseProps, FileUploadResponseMetadata } from "./types";
import { UploadController } from "./UploadController";

/** Internal props shared by uploads with plain-text responses and uploads with a custom parser. */
export type FileUploadControllerProps = FileUploadBaseProps<unknown> & {
    parseResponse?: (metadata: FileUploadResponseMetadata) => unknown;
};

const readResponseText = (metadata: FileUploadResponseMetadata): string => metadata.responseText;

/**
 * Connect one upload controller to the component's lifetime and subscribe to its view snapshot.
 * The controller keeps its identity while reading current props, applies changed configuration,
 * and releases its resources on unmount. Initial files are consumed only once per mount.
 *
 * @param widgetId Identifier used when creating the controller; keep it stable for this mount.
 * @param props Current upload configuration and callbacks; an omitted parser returns response text.
 * @returns The stable controller for actions and the current snapshot for rendering.
 */
export function useUploadController(
    widgetId: string,
    props: FileUploadControllerProps,
): { controller: UploadController; snapshot: ReturnType<UploadController["getSnapshot"]> } {
    // Keep the controller across renders while letting ongoing uploads read current callbacks and options.
    const latestProps = React.useRef(props);
    latestProps.current = props;
    const [controller] = React.useState(
        () =>
            new UploadController(widgetId, () => ({
                ...latestProps.current,
                parseResponse: latestProps.current.parseResponse ?? readResponseText,
            })),
    );
    const snapshot = React.useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
    const initialFilesAdded = React.useRef(false);

    React.useEffect(() => controller.attach(), [controller]);
    React.useEffect(() => {
        controller.configure();
    }, [
        controller,
        props.acceptedFileTypes,
        props.maxFileSize,
        props.maxNumberOfFiles,
        props.method,
        props.concurrency,
        props.disabled,
        props.autoUpload,
    ]);
    React.useEffect(() => {
        // Initial files belong to this mount; neither StrictMode effect replay nor reset should add them again.
        if (initialFilesAdded.current) return;
        initialFilesAdded.current = true;
        if (props.initialFiles?.length) controller.addInitialFiles(props.initialFiles);
    }, [controller, props.initialFiles]);

    return { controller, snapshot };
}
