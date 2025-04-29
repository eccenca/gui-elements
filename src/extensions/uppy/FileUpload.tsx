import React, { FC, useEffect } from "react";
import Uppy, { Locale, Restrictions } from "@uppy/core";
import { DragDrop, ProgressBar, useUppy } from "@uppy/react";
import XHRUpload, { XHRUploadOptions } from "@uppy/xhr-upload";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import "@uppy/progress-bar/dist/style.css";

export interface FileUploadProps {
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
}

export const FileUpload: FC<FileUploadProps> = ({
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

    useEffect(() => {
        if (resetForm) {
            uppy.reset();
        }

        return () => {
            uppy.close();
        };
    }, [resetForm, uppy]);

    useEffect(() => {
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

    return (
        <>
            <DragDrop uppy={uppy} />
            <ProgressBar uppy={uppy} />
        </>
    );
};
