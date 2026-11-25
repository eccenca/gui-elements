import React from "react";

import Button from "../../components/Button/Button";
import SimpleDialog, { SimpleDialogProps } from "../../components/Dialog/SimpleDialog";
import HtmlContentBlock from "../../components/Typography/HtmlContentBlock";

interface ActivityExecutionErrorReportModalProps extends Pick<
    SimpleDialogProps,
    "aria-label" | "aria-labelledby" | "fullScreenTogglerTexts"
> {
    /**
     * Title of the modal.
     * If set, it is used as the accessible name of the dialog via `aria-labelledby`
     * (unless `aria-labelledby` is given explicitly), so `aria-label` is ignored.
     * Use `aria-label` only for modals without title.
     * If neither `title`, a non-empty `aria-label` nor `aria-labelledby` is set, then "Activity execution error report" is used as `aria-label`.
     */
    title?: string;
    // Called when the close button is clicked
    onDiscard: () => any;
    // The error report
    report: React.JSX.Element;
    // Value of the download button
    downloadButtonValue: string;
    // Value of the close button
    closeButtonValue: string;
    // Function that fetches the Markdown error report
    fetchErrorReport: () => Promise<string | undefined>;
}

/** Shows the execution error report to the user and offers to download the report. */
export const ActivityExecutionErrorReportModal = ({
    title,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    onDiscard,
    report,
    downloadButtonValue,
    closeButtonValue,
    fullScreenTogglerTexts,
    fetchErrorReport,
}: ActivityExecutionErrorReportModalProps) => {
    const fileName =
        "Activity execution report from " +
        new Date().toISOString().replace(/T/, " ").replace(/:/g, "-").substr(0, 19) +
        ".md";
    const handleDownload = async () => {
        const markdown = await fetchErrorReport();
        if (markdown) {
            const element = document.createElement("a");
            element.href = window.URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
            element.download = fileName;
            //the above code is equivalent to
            document.body.appendChild(element);
            //onClick property
            element.click();
            document.body.removeChild(element);
        }
    };

    return (
        <SimpleDialog
            title={title}
            aria-label={ariaLabel || "Activity execution error report"}
            aria-labelledby={ariaLabelledby}
            isOpen={true}
            size="large"
            showFullScreenToggler
            fullScreenTogglerTexts={fullScreenTogglerTexts}
            onClose={onDiscard}
            actions={[
                <Button data-test-id={"error-report-download-btn"} affirmative onClick={handleDownload} key="download">
                    {downloadButtonValue}
                </Button>,
                <Button data-test-id={"error-report-close-btn"} key="close" onClick={onDiscard}>
                    {closeButtonValue}
                </Button>,
            ]}
        >
            <HtmlContentBlock noScrollbarsOnChildren>{report}</HtmlContentBlock>
        </SimpleDialog>
    );
};
