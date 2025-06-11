import React from "react";
import Uppy, { Locale, Restrictions, UppyEventMap, UppyFile } from "@uppy/core";
import { DragDrop, ProgressBar, useUppy } from "@uppy/react";
import XHRUpload, { XHRUploadOptions } from "@uppy/xhr-upload";

import { TestableComponent } from "../../components/interfaces";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import "@uppy/progress-bar/dist/style.css";

type eventNames = keyof UppyEventMap;

export interface FileUploadProps extends TestableComponent {
    /**
     * upload instance id
     */
    id?: string;
    /**
     * upload error callback function
     */
    onError?: (responseText: string) => void;
    /**
     * upload success callback function
     */
    onSuccess?: (responseText: string) => void;
    /**
     * upload response callback function
     */
    handleResponseData?: (responseText: string) => void;
    /**
     * locale options, like button labels etc.
     */
    localeOptions?: Locale;
    /**
     * reset form after upload or in case of error/navigation steps
     */
    resetForm?: boolean;
    /**
     * auto proceed bolean
     */
    autoProceed?: boolean;
    /**
     * upload restrictions
     */
    restrictions?: Restrictions;
    /**
     * additional upload files
     */
    additionalFiles?: {
        id: string;
        name: string;
        size: number;
        data: Blob;
    }[];
    /**
     * xhr upload options
     */
    xhrUploadOptions: XHRUploadOptions;
    /**
     * uppy events to register and unregister to
     */
    events?: { [key in eventNames]?: any };
    /**
     *  set uppy instance
     */
    setInstance?: (instance: Uppy) => void;
}

export { ProgressBar as FileUploadProgressBar, DragDrop as FileUploadDragDrop} from "@uppy/react";



export const FileUpload: React.FC<FileUploadProps> = ({
    id,
    onError,
    onSuccess,
    handleResponseData,
    resetForm,
    autoProceed = false,
    restrictions,
    additionalFiles,
    xhrUploadOptions,
    localeOptions,
    events,
    setInstance,
    children,
    ...rest
}) => {
    const uppy = useUppy(() => {
        return new Uppy({
            id,
            autoProceed,
            restrictions,
            locale: localeOptions,
        })
            .on("upload-success", (_, response) => {
                onSuccess?.(response.body);
            })
            .use(XHRUpload, {
                ...xhrUploadOptions,
                getResponseData: (responseText) => {
                    handleResponseData?.(responseText);
                    return responseText;
                },
                getResponseError: (responseText) => {
                    uppy.reset();

                    onError?.(responseText);
                    return new Error(responseText);
                },
            });
    });

    //events
    React.useEffect(() => {
        uppy && setInstance && setInstance(uppy);
        const eventEntries = Object.entries(events ?? {}) as [keyof UppyEventMap, (file: UppyFile) => Promise<void>][];
        const unregisterEvents = () => {
            eventEntries.length && eventEntries.forEach(([event, handler]) => uppy.off(event, handler));
        };

        unregisterEvents();

        eventEntries.length &&
            eventEntries.forEach(([event, handler]) => {
                uppy.on(event, handler);
            });

        return () => unregisterEvents();
    },[events, uppy]);

    React.useEffect(() => {
        if (resetForm) {
            uppy.reset();
        }

        return () => {
            uppy.close();
        };
    }, [resetForm, uppy]);

    React.useEffect(() => {
        if (additionalFiles) {
            additionalFiles.forEach((file) => {
                uppy.addFile({
                    name: file.name,
                    data: file.data,
                    size: file.size,
                    id: file.id,
                });
            });
        }
    }, [additionalFiles, uppy]);

    if (!uppy) return null;


    return (
        <div {...rest}>
            {children ? (
                children
            ) : (
                <>
                    <DragDrop uppy={uppy} />
                    <ProgressBar uppy={uppy} />
                </>
            )}
        </div>
    );
};