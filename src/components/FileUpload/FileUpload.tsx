import React from "react";
import classNames from "classnames";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import ProgressBar from "../ProgressBar/ProgressBar";

import { FileUploadHandle, FileUploadLabels, FileUploadParsedProps, FileUploadTextProps } from "./types";
import { UploadRow } from "./UploadController";
import { UppyContextProvider, useDropzone, useFileInput } from "./uppyHeadless";
import { useRemovalFocus } from "./useRemovalFocus";
import { FileUploadControllerProps, useUploadController } from "./useUploadController";

interface FileSelectionProps {
    buttonRef: React.Ref<HTMLButtonElement>;
    buttonDescriptionIds: string | undefined;
    disabled: boolean;
    labels: FileUploadLabels;
}

const FileSelection = ({ buttonRef, buttonDescriptionIds, disabled, labels }: FileSelectionProps) => {
    const [dragging, setDragging] = React.useState(false);
    // Enter/leave events also fire for nested content; count them to avoid flickering between children.
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
    const resetDragState = React.useCallback(() => {
        dragEntryCount.current = 0;
        setDragging(false);
    }, []);
    React.useEffect(() => {
        // Disabled handlers no longer track drag exits, so discard any drag already in progress.
        if (disabled) resetDragState();
    }, [disabled, resetDragState]);
    const { getRootProps } = useDropzone({
        noClick: true,
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
    });
    const { getButtonProps, getInputProps } = useFileInput();
    const dropzoneProps = getRootProps();
    const inputProps = getInputProps();
    const buttonProps = getButtonProps();
    const preventDisabledDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        // Uppy skips its onDrop callback for non-file drops, but those must also clear the highlight.
        resetDragState();
        if (disabled) preventDisabledDrop(event);
        else dropzoneProps.onDrop(event);
    };

    return (
        <div
            className={classNames(`${eccgui}-fileupload__dropzone`, {
                [`${eccgui}-fileupload__dropzone--dragging`]: dragging && !disabled,
                [`${eccgui}-fileupload__dropzone--disabled`]: disabled,
            })}
            data-dropzone-for="Files"
            data-state={disabled ? "disabled" : dragging ? "dragging" : "idle"}
            onDragEnter={disabled ? preventDisabledDrop : dropzoneProps.onDragEnter}
            onDragLeave={disabled ? preventDisabledDrop : dropzoneProps.onDragLeave}
            onDragOver={disabled ? preventDisabledDrop : dropzoneProps.onDragOver}
            onDrop={handleDrop}
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

interface FileUploadRowProps {
    row: UploadRow;
    widgetId: string;
    labels: FileUploadLabels;
    disabled: boolean;
    onCancel: (fileId: string) => void;
    onRetry: (fileId: string) => void;
    onRemove: (fileId: string) => void;
    removeButtonRef: React.Ref<HTMLButtonElement | HTMLAnchorElement>;
}

const FileUploadRow = ({
    row,
    widgetId,
    labels,
    disabled,
    onCancel,
    onRetry,
    onRemove,
    removeButtonRef,
}: FileUploadRowProps) => {
    const { file, status, progress } = row;
    const nameId = `${widgetId}-${file.id}-name`;
    const isCancelled = status === "cancelled";
    const canCancel = status === "uploading" || status === "queued" || status === "pendingApproval";
    const canRetry = status === "error" || isCancelled;
    const progressIntent = status === "complete" ? "success" : status === "error" ? "danger" : undefined;

    return (
        <div role="listitem" data-state={status} className={`${eccgui}-fileupload__file`}>
            <div className={`${eccgui}-fileupload__progress-header`}>
                <span id={nameId}>{file.name}</span>
                <span className={`${eccgui}-fileupload__progress-actions`}>
                    {isCancelled ? (
                        <span className={`${eccgui}-fileupload__cancelled-status`}>
                            <Icon name="state-warning" intent="warning" aria-hidden="true" />
                            {labels.uploadCancelled}
                        </span>
                    ) : (
                        <span aria-hidden="true">{progress}%</span>
                    )}
                    {canCancel && <Button outlined small text={labels.cancelFile} onClick={() => onCancel(file.id)} />}
                    {canRetry && (
                        <Button
                            outlined
                            small
                            text={labels.retry}
                            disabled={disabled}
                            onClick={() => onRetry(file.id)}
                        />
                    )}
                    {isCancelled && (
                        <Button
                            outlined
                            small
                            ref={removeButtonRef}
                            text={labels.removeFile}
                            aria-describedby={nameId}
                            onClick={() => onRemove(file.id)}
                        />
                    )}
                </span>
            </div>
            <UploadProgress
                name={labels.fileUploadProgress(file)}
                value={progress}
                active={status === "uploading"}
                intent={progressIntent}
                valueText={isCancelled ? labels.uploadCancelled : undefined}
            />
        </div>
    );
};

function FileUploadInner(props: FileUploadControllerProps, ref: React.ForwardedRef<FileUploadHandle<unknown>>) {
    const generatedId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const widgetId = props.id ?? `file-upload-${generatedId}`;
    const { controller, snapshot } = useUploadController(widgetId, props);
    const { files, state, error, announcement } = snapshot;
    const { groupRef, browseRef, registerRemoveButton, removeRow } = useRemovalFocus(files, controller.remove);
    React.useImperativeHandle(ref, () => controller, [controller]);

    const { name, hideName = false, labels, instructions, disabled = false, selectionDisabled = false } = props;
    const labelId = `${widgetId}-label`;
    const instructionsId = `${widgetId}-instructions`;
    const errorId = `${widgetId}-error`;
    const descriptionIds =
        [instructions ? instructionsId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

    const hasPendingWork = state.uploading > 0 || state.queued > 0 || state.pendingApproval > 0;

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
                                    {hasPendingWork && (
                                        <Button outlined small text={labels.stopUploads} onClick={controller.stop} />
                                    )}
                                    {!hasPendingWork && state.cancelled > 0 && (
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
                            <FileUploadRow
                                key={row.file.id}
                                row={row}
                                widgetId={widgetId}
                                labels={labels}
                                disabled={disabled}
                                onCancel={controller.cancelFile}
                                onRetry={controller.retry}
                                onRemove={removeRow}
                                removeButtonRef={(element) => registerRemoveButton(row.file.id, element)}
                            />
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
/**
 * Select and upload files through a native picker or dropzone, with localized progress,
 * errors and retry actions. Approved files upload automatically unless autoUpload is false.
 * The forwarded ref exposes upload, cancel, remove and reset for application-controlled flows.
 * Responses are strings by default; parseResponse determines the response type when provided.
 */
export const FileUpload = React.forwardRef(FileUploadInner) as FileUploadComponent;
export default FileUpload;
