import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import ProgressBar from "../ProgressBar/ProgressBar";

import {
    FileUploadBaseProps,
    FileUploadHandle,
    FileUploadLabels,
    FileUploadParsedProps,
    FileUploadResponseMetadata,
    FileUploadTextProps,
} from "./types";
import { UploadController } from "./UploadController";
import { UppyContextProvider, useDropzone, useFileInput } from "./uppyHeadless";

interface FileSelectionProps {
    buttonRef: React.Ref<HTMLButtonElement>;
    buttonDescriptionIds: string | undefined;
    disabled: boolean;
    labels: FileUploadLabels;
}

const FileSelection = ({ buttonRef, buttonDescriptionIds, disabled, labels }: FileSelectionProps) => {
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
                aria-hidden="true"
                disabled={disabled}
                onChange={disabled ? undefined : inputProps.onChange}
                tabIndex={-1}
            />
            <button
                {...buttonProps}
                ref={buttonRef}
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

interface ProgressProps {
    name: string;
    value: number;
    active: boolean;
    intent?: "success" | "danger";
    valueText?: string;
}

const UploadProgress = ({ name, value, active, intent, valueText }: ProgressProps) => (
    <div
        role="progressbar"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={valueText}
    >
        <ProgressBar aria-hidden="true" animate={active} stripes={active} intent={intent} value={value / 100} />
    </div>
);

type InternalProps = FileUploadBaseProps<unknown> & {
    parseResponse?: (metadata: FileUploadResponseMetadata) => unknown;
};

const readResponseText = (metadata: FileUploadResponseMetadata): string => metadata.responseText;

function FileUploadInner(props: InternalProps, ref: React.ForwardedRef<FileUploadHandle<unknown>>) {
    const generatedId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const widgetId = props.id ?? `file-upload-${generatedId}`;
    const current = React.useRef(props);
    current.current = props;
    const [controller] = React.useState(
        () =>
            new UploadController(widgetId, () => ({
                ...current.current,
                parseResponse: current.current.parseResponse ?? readResponseText,
            })),
    );
    const { files, state, error, announcement } = React.useSyncExternalStore(
        controller.subscribe,
        controller.getSnapshot,
        controller.getSnapshot,
    );
    const initialized = React.useRef(false);
    const groupRef = React.useRef<HTMLDivElement>(null);
    const browseRef = React.useRef<HTMLButtonElement>(null);
    const removeRefs = React.useRef(new Map<string, HTMLButtonElement | HTMLAnchorElement>());
    const pendingFocus = React.useRef<string[]>();
    React.useEffect(() => {
        if (!pendingFocus.current) return;
        const next = pendingFocus.current.map((id) => removeRefs.current.get(id)).find(Boolean);
        pendingFocus.current = undefined;
        const browse = browseRef.current;
        (next ?? (browse && !browse.disabled ? browse : groupRef.current))?.focus();
    }, [files]);
    React.useImperativeHandle(ref, () => controller, [controller]);
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
        if (!initialized.current) {
            initialized.current = true;
            if (props.initialFiles?.length) controller.addInitialFiles(props.initialFiles);
        }
    }, [controller, props.initialFiles]);

    const { name, hideName = false, labels, instructions, disabled = false, selectionDisabled = false } = props;
    const labelId = `${widgetId}-label`;
    const instructionsId = `${widgetId}-instructions`;
    const errorId = `${widgetId}-error`;
    const descriptionIds =
        [instructions ? instructionsId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

    const removeRow = (fileId: string) => {
        const removableIds = files.filter((row) => row.status === "cancelled").map((row) => row.file.id);
        const index = removableIds.indexOf(fileId);
        pendingFocus.current = removableIds.slice(index + 1).concat(removableIds.slice(0, index).reverse());
        controller.remove(fileId);
    };
    const active = state.uploading > 0 || state.queued > 0 || state.pendingApproval > 0;

    return (
        <div
            ref={groupRef}
            role="group"
            tabIndex={-1}
            aria-describedby={descriptionIds}
            aria-busy={state.uploading > 0 || undefined}
            aria-label={hideName ? name : undefined}
            aria-labelledby={hideName ? undefined : labelId}
            className={`${eccgui}-fileupload`}
        >
            {!hideName && (
                <div className={`${eccgui}-fileupload__label`} id={labelId}>
                    {name}
                </div>
            )}
            <UppyContextProvider uppy={controller.uppy}>
                <FileSelection
                    buttonRef={browseRef}
                    buttonDescriptionIds={descriptionIds}
                    disabled={disabled || selectionDisabled}
                    labels={labels}
                />
            </UppyContextProvider>
            {files.length > 0 && (
                <div className={`${eccgui}-fileupload__progress`}>
                    {files.length > 1 && (
                        <div className={`${eccgui}-fileupload__overall-progress`}>
                            <div className={`${eccgui}-fileupload__progress-header`}>
                                <span>{labels.overallUploadProgress}</span>
                                <span className={`${eccgui}-fileupload__progress-actions`}>
                                    <span aria-hidden="true">{state.progress}%</span>
                                    {active && (
                                        <Button outlined small text={labels.stopUploads} onClick={controller.stop} />
                                    )}
                                    {!active && state.cancelled > 0 && (
                                        <Button
                                            outlined
                                            small
                                            text={labels.continueUpload}
                                            disabled={disabled}
                                            onClick={controller.continue}
                                        />
                                    )}
                                </span>
                            </div>
                            <UploadProgress
                                name={labels.overallUploadProgress}
                                value={state.progress}
                                active={state.uploading > 0}
                                intent={state.allSuccessful ? "success" : undefined}
                            />
                            <div className={`${eccgui}-fileupload__completed-files`}>
                                {labels.completedFiles(state.completed, files.length)}
                            </div>
                        </div>
                    )}
                    <div role="list" aria-label={labels.uploadProgress} className={`${eccgui}-fileupload__file-list`}>
                        {files.map((row) => (
                            <div
                                role="listitem"
                                key={row.file.id}
                                data-state={row.status}
                                className={`${eccgui}-fileupload__file`}
                            >
                                <div className={`${eccgui}-fileupload__progress-header`}>
                                    <span id={`${widgetId}-${row.file.id}-name`}>{row.file.name}</span>
                                    <span className={`${eccgui}-fileupload__progress-actions`}>
                                        {row.status === "cancelled" ? (
                                            <span className={`${eccgui}-fileupload__cancelled-status`}>
                                                <Icon name="state-warning" intent="warning" aria-hidden="true" />
                                                {labels.uploadCancelled}
                                            </span>
                                        ) : (
                                            <span aria-hidden="true">{row.progress}%</span>
                                        )}
                                        {["uploading", "queued", "pendingApproval"].includes(row.status) && (
                                            <Button
                                                outlined
                                                small
                                                text={labels.cancelFile}
                                                onClick={() => controller.cancelFile(row.file.id)}
                                            />
                                        )}
                                        {(row.status === "error" || row.status === "cancelled") && (
                                            <Button
                                                outlined
                                                small
                                                text={labels.retry}
                                                disabled={disabled}
                                                onClick={() => controller.retry(row.file.id)}
                                            />
                                        )}
                                        {row.status === "cancelled" && (
                                            <Button
                                                outlined
                                                small
                                                ref={(element) => {
                                                    if (element) removeRefs.current.set(row.file.id, element);
                                                    else removeRefs.current.delete(row.file.id);
                                                }}
                                                text={labels.removeFile}
                                                aria-describedby={`${widgetId}-${row.file.id}-name`}
                                                onClick={() => removeRow(row.file.id)}
                                            />
                                        )}
                                    </span>
                                </div>
                                <UploadProgress
                                    name={labels.fileUploadProgress(row.file)}
                                    value={row.progress}
                                    active={row.status === "uploading"}
                                    intent={
                                        row.status === "complete"
                                            ? "success"
                                            : row.status === "error"
                                              ? "danger"
                                              : undefined
                                    }
                                    valueText={row.status === "cancelled" ? labels.uploadCancelled : undefined}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {instructions && (
                <div className={`${eccgui}-fileupload__instructions`} id={instructionsId}>
                    {instructions}
                </div>
            )}
            {error && (
                <div className={`${eccgui}-fileupload__error`} id={errorId} role="alert">
                    {labels.formatError(error)}
                </div>
            )}
            <div className="cds--visually-hidden" role="status">
                {announcement}
            </div>
        </div>
    );
}

interface FileUploadComponent {
    (props: FileUploadTextProps & React.RefAttributes<FileUploadHandle<string>>): React.JSX.Element;
    <T>(props: FileUploadParsedProps<T> & React.RefAttributes<FileUploadHandle<T>>): React.JSX.Element;
}

// React.forwardRef cannot preserve an overloaded generic call signature.
export const FileUpload = React.forwardRef(FileUploadInner) as FileUploadComponent;
export default FileUpload;
