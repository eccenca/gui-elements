# FileUpload

Import `FileUpload` and its types from `@eccenca/gui-elements`. The component owns selection,
approval, scheduling, transport, progress and retry state. Supply an endpoint and localized
`FileUploadLabels`; the examples below receive these labels from the application.
See `FileUpload.stories.tsx` for a complete English label set and visual states.

Uploads start automatically, with one active request and at most one incomplete file by default.
Use `maxNumberOfFiles={null}` for unlimited selection and `concurrency` to allow parallel requests.
Successful rows release selection capacity. Cancelled rows remain in the count and overall progress
until removed: one successful and one cancelled equal-size file show 50%, not 100%.

## Manual uploads

```tsx
import React from "react";
import {
    FileUpload,
    FileUploadHandle,
    FileUploadLabels,
} from "@eccenca/gui-elements";

export function ManualUpload({ labels }: { labels: FileUploadLabels }) {
    const upload = React.useRef<FileUploadHandle>(null);
    const [busy, setBusy] = React.useState(false);
    const [message, setMessage] = React.useState("");

    async function start() {
        if (!upload.current) return;
        setBusy(true);
        try {
            const result = await upload.current.upload();
            setMessage(
                `${result.successful.length} uploaded, ${result.failed.length} failed, ` +
                    `${result.cancelled.length} cancelled`,
            );
        } catch (error) {
            // For example, upload() rejects if the widget is disabled.
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to start uploads",
            );
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <FileUpload
                ref={upload}
                name="Files"
                labels={labels}
                endpoint="/files"
                autoUpload={false}
            />
            <button type="button" disabled={busy} onClick={start}>
                Upload
            </button>
            <p role="status">{message}</p>
        </>
    );
}
```

Localize the surrounding button and summary in your application too. Manual mode delays automatic
request starts, not approval checks. Retry and Continue are explicit user requests and can start
uploads in manual mode.

## Typed responses

Without a parser, response bodies are strings. A parser determines the body type of both
`onUploadSuccess` and completion results; no generic argument or cast is needed. Validate external
JSON at the boundary:

```tsx
import {
    FileUpload,
    FileUploadLabels,
    FileUploadResponseMetadata,
} from "@eccenca/gui-elements";

function parseReceipt({ responseText }: FileUploadResponseMetadata): {
    id: string;
} {
    const value: unknown = JSON.parse(responseText);
    if (
        typeof value !== "object" ||
        value === null ||
        !("id" in value) ||
        typeof value.id !== "string"
    ) {
        throw new Error("Expected an upload receipt with a string id");
    }
    return { id: value.id };
}

export function ReceiptUpload({
    labels,
    onReceipt,
}: {
    labels: FileUploadLabels;
    onReceipt: (id: string) => void;
}) {
    return (
        <FileUpload
            name="Files"
            labels={labels}
            endpoint="/files"
            parseResponse={parseReceipt}
            onUploadSuccess={({ body }) => onReceipt(body.id)}
        />
    );
}
```

Parser exceptions produce inline errors with `kind: "response"`, not success callbacks.
Intentional `null` and `undefined` parser results are preserved. For a manual parsed upload, use
`FileUploadHandle<ReturnType<typeof parseReceipt>>` as the ref type.

## Approval and overwrite prompts

`beforeUpload(file, signal)` runs after local restrictions, on selection—even with
`autoUpload={false}`. Return `true` to approve or `false` to decline without an error. Throwing or
rejecting produces a retriable `validation` error. A synchronous decision needs no `async` wrapper:

```tsx
<FileUpload
    name="Files"
    labels={labels}
    endpoint="/files"
    beforeUpload={(file) => file.name !== "protected.ttl"}
/>
```

For overwrite approval, keep domain checks and dialog rendering in the application:

```tsx
import {
    FileUpload,
    FileUploadFile,
    FileUploadLabels,
} from "@eccenca/gui-elements";

interface OverwriteUploadProps {
    labels: FileUploadLabels;
    resourceExists: (name: string, signal: AbortSignal) => Promise<boolean>;
    // The application dialog must close and settle its promise when the signal aborts.
    confirmReplace: (
        file: FileUploadFile,
        signal: AbortSignal,
    ) => Promise<boolean>;
}

export function OverwriteUpload({
    labels,
    resourceExists,
    confirmReplace,
}: OverwriteUploadProps) {
    return (
        <FileUpload
            name="Files"
            labels={labels}
            endpoint="/files"
            maxNumberOfFiles={null}
            beforeUpload={async (file, signal) => {
                const exists = await resourceExists(file.name, signal);
                if (signal.aborted) return false;
                return !exists || (await confirmReplace(file, signal));
            }}
        />
    );
}
```

Checks for different files may run concurrently: one unanswered prompt does not block another
approved file. Handle prompts independently, keyed by `file.id`. Cancellation, removal, reset and
unmount abort pending approval signals; observe them to cancel checks and dismiss dialogs. Stale
decisions cannot start an upload. Approval is not a per-request hook: transport retries do not
repeat a successful approval, whereas retrying a failed approval runs the check again.

## Localized restriction errors

Use `labels.formatError` for display and `onUploadError` for notification/diagnostics. Both receive
the same discriminated `FileUploadError`. For `kind === "restriction"`, switch on
`error.restriction.code` instead of parsing `error.error.message`:

| Code               | Details                                                                               |
| ------------------ | ------------------------------------------------------------------------------------- |
| `maxFileSize`      | `maxFileSize` in bytes                                                                |
| `fileType`         | `acceptedFileTypes`, an immutable snapshot of the configured extensions/MIME patterns |
| `maxNumberOfFiles` | `maxNumberOfFiles`, the incomplete-selection limit                                    |
| `duplicate`        | A file already present in the retained selection                                      |
| `unknown`          | Fallback for an unclassified rejection                                                |

`error.file` is optional (for example, a count rejection can apply to a selection). Include a generic
translation when no file is available. If both size and type fail, size takes precedence in the
structured detail. Diagnostic error text is not a localization contract. Other error kinds are
`validation`, `response` and `transport`.

## Lifecycle and completion

- `upload()` waits for the logical batch, including pending approvals. Overlapping calls share a
  result; calling while idle returns the retained result. File failures and cancellations resolve
  in the result, rather than rejecting the promise. `reason: "settled"` does not mean all files succeeded.
- `onComplete` fires once per settled/cancelled logical batch. Its result is cumulative for retained
  rows, not a delta; earlier successes can appear again. Use `onUploadSuccess` for per-file domain
  side effects so later batches do not repeat them.
- Files rejected during selection and declined approvals do not enter the result. If restrictions
  change before a queued file starts, that file's rejection appears in `result.failed`. An empty result is not
  proof that a file uploaded. Use `state.allSuccessful` to enable a “continue after upload” action;
  transfer progress alone does not prove HTTP success.
- The visible Stop action retains cancelled rows. Continue retries remaining incomplete rows;
  remove unwanted cancelled files first. `ref.cancel()` instead cancels work and clears the selection,
  retaining inline errors. `ref.reset()` also clears progress and errors.
- `ref.remove(fileId)` removes local state and pending work, never a server resource.
- `initialFiles` is consumed once per mount through the usual restriction/approval path. Rerenders
  and reset do not re-add these files.
- `disabled` prevents selection and future request starts, but cancellation/removal remain available.
  `selectionDisabled` blocks only picker/drop interaction.
