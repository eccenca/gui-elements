import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Icon from "../Icon/Icon";

import { FileUploadError, FileUploadFile, FileUploadHandle, FileUploadProps } from "./types";
import { HeadlessUppyFile, Uppy, UppyContextProvider, useDropzone, useFileInput } from "./uppyHeadless";

const publicFile = (file: { id: string; name?: string; type?: string; size?: number | null }): FileUploadFile => ({
    id: file.id,
    name: file.name ?? "",
    ...(file.type ? { type: file.type } : {}),
    ...(typeof file.size === "number" ? { size: file.size } : {}),
});

interface FileSelectionProps {
    buttonDescriptionIds: string | undefined;
    disabled: boolean;
    labels: FileUploadProps["labels"];
}

const FileSelection = ({ buttonDescriptionIds, disabled, labels }: FileSelectionProps) => {
    const [dragging, setDragging] = React.useState(false);
    const dragEntryCount = React.useRef(0);
    const handleDragEnter = React.useCallback(() => {
        dragEntryCount.current += 1;
        setDragging(true);
    }, []);
    const handleDragLeave = React.useCallback(() => {
        dragEntryCount.current = Math.max(0, dragEntryCount.current - 1);
        if (dragEntryCount.current === 0) {
            setDragging(false);
        }
    }, []);
    const handleDrop = React.useCallback(() => {
        dragEntryCount.current = 0;
        setDragging(false);
    }, []);
    const { getRootProps } = useDropzone({
        noClick: true,
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
    });
    const { getButtonProps, getInputProps } = useFileInput();
    const dropzoneProps = getRootProps();
    const inputProps = getInputProps();
    const buttonProps = getButtonProps();
    const preventDisabledDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div
            className={
                `${eccgui}-fileupload__dropzone` +
                (dragging ? ` ${eccgui}-fileupload__dropzone--dragging` : "") +
                (disabled ? ` ${eccgui}-fileupload__dropzone--disabled` : "")
            }
            data-dropzone-for="Files"
            data-state={dragging ? "dragging" : disabled ? "disabled" : "idle"}
            onDragEnter={disabled ? preventDisabledDrop : dropzoneProps.onDragEnter}
            onDragLeave={disabled ? preventDisabledDrop : dropzoneProps.onDragLeave}
            onDragOver={disabled ? preventDisabledDrop : dropzoneProps.onDragOver}
            onDrop={disabled ? preventDisabledDrop : dropzoneProps.onDrop}
        >
            <input
                {...inputProps}
                className="cds--visually-hidden"
                disabled={disabled}
                onChange={disabled ? undefined : inputProps.onChange}
                tabIndex={-1}
            />
            <button
                {...buttonProps}
                aria-controls={inputProps.id}
                aria-describedby={buttonDescriptionIds}
                className={`${eccgui}-fileupload__button`}
                disabled={disabled}
                role="button"
            >
                <Icon name="item-upload" aria-hidden="true" />
                <span>{labels.dropHereOr}</span> <strong>{labels.browse}</strong>
            </button>
        </div>
    );
};

function FileUploadInner<T = string>(
    {
        id,
        name,
        hideName = false,
        labels,
        instructions,
        acceptedFileTypes,
        maxFileSize,
        maxNumberOfFiles = 1,
        onUploadError,
        disabled = false,
    }: FileUploadProps<T>,
    ref: React.ForwardedRef<FileUploadHandle>,
) {
    const generatedId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const widgetId = id ?? `file-upload-${generatedId}`;
    const labelId = `${widgetId}-label`;
    const instructionsId = `${widgetId}-instructions`;
    const errorId = `${widgetId}-error`;
    const [selectionStatus, setSelectionStatus] = React.useState<string>();
    const [restrictionError, setRestrictionError] = React.useState<string>();
    const labelsRef = React.useRef(labels);
    const onUploadErrorRef = React.useRef(onUploadError);
    labelsRef.current = labels;
    onUploadErrorRef.current = onUploadError;
    const [uppy] = React.useState(
        () =>
            new Uppy({
                id: widgetId,
                autoProceed: false,
                restrictions: { allowedFileTypes: acceptedFileTypes, maxFileSize, maxNumberOfFiles },
            }),
    );

    React.useEffect(() => {
        uppy.setOptions({ restrictions: { allowedFileTypes: acceptedFileTypes, maxFileSize, maxNumberOfFiles } });
    }, [acceptedFileTypes, maxFileSize, maxNumberOfFiles, uppy]);

    React.useEffect(() => {
        const handleFileAdded = (file: HeadlessUppyFile) => {
            const selectedFile = publicFile(file);
            setRestrictionError(undefined);
            setSelectionStatus(labelsRef.current.selectedFile?.(selectedFile) ?? selectedFile.name);
        };
        const handleRestrictionFailed = (file: HeadlessUppyFile | undefined, error: Error) => {
            const rejectedFile = file ? publicFile(file) : undefined;
            const uploadError: FileUploadError = {
                kind: "restriction",
                error,
                ...(rejectedFile ? { file: rejectedFile } : {}),
            };
            setRestrictionError(labelsRef.current.restrictionError?.(error, rejectedFile) ?? error.message);
            onUploadErrorRef.current?.(uploadError);
        };

        uppy.on("file-added", handleFileAdded);
        uppy.on("restriction-failed", handleRestrictionFailed);
        return () => {
            uppy.off("file-added", handleFileAdded);
            uppy.off("restriction-failed", handleRestrictionFailed);
        };
    }, [uppy]);

    React.useEffect(() => () => uppy.destroy(), [uppy]);

    React.useImperativeHandle(
        ref,
        () => ({
            upload: async () => {
                await uppy.upload();
            },
            cancel: () => uppy.cancelAll(),
            reset: () => {
                uppy.cancelAll();
                setSelectionStatus(undefined);
                setRestrictionError(undefined);
            },
        }),
        [uppy],
    );

    const descriptionIds = [instructions ? instructionsId : undefined, restrictionError ? errorId : undefined]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            aria-describedby={descriptionIds || undefined}
            aria-label={hideName ? name : undefined}
            aria-labelledby={hideName ? undefined : labelId}
            className={`${eccgui}-fileupload`}
            role="group"
        >
            {!hideName && (
                <div className={`${eccgui}-fileupload__label`} id={labelId}>
                    {name}
                </div>
            )}
            <UppyContextProvider uppy={uppy}>
                <FileSelection buttonDescriptionIds={descriptionIds || undefined} disabled={disabled} labels={labels} />
            </UppyContextProvider>
            {instructions && (
                <div className={`${eccgui}-fileupload__instructions`} id={instructionsId}>
                    {instructions}
                </div>
            )}
            {restrictionError && (
                <div className={`${eccgui}-fileupload__error`} id={errorId} role="alert">
                    {restrictionError}
                </div>
            )}
            {selectionStatus && <div role="status">{selectionStatus}</div>}
        </div>
    );
}

export const FileUpload = React.forwardRef(FileUploadInner) as <T = string>(
    props: FileUploadProps<T> & React.RefAttributes<FileUploadHandle>,
) => React.JSX.Element;

export default FileUpload;
