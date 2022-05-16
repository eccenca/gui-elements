import {Button, HtmlContentBlock, IconButton, SimpleDialog} from "../../index";
import React, { useState } from "react";

interface IProps {
    // Title of the modal
    title?: string
    // Called when the close button is clicked
    onDiscard: () => any
    // The error report
    report: JSX.Element
    // Value of the download button
    downloadButtonValue: string
    // Value of the close button
    closeButtonValue: string
    // Function that fetches the Markdown error report
    fetchErrorReport: () => Promise<string | undefined>
}

/** Shows the execution error report to the user and offers to download the report. */
export const ActivityExecutionErrorReportModal = ({title, onDiscard, report, downloadButtonValue, closeButtonValue, fetchErrorReport}: IProps) => {
    const [displayFullscreen, setDisplayFullscreen] = useState<boolean>(false);
    const fileName = "Activity execution report from " + (new Date()).toISOString().replace(/T/, " ").replace(/:/g, "-").substr(0, 19) + ".md"
    const handleDownload = async () => {
        const markdown = await fetchErrorReport()
        if(markdown) {
            const element = document.createElement("a");
            element.href = window.URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
            element.download = fileName
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
            isOpen={true}
            size={displayFullscreen ? "fullscreen" : "large"}
            onClose={onDiscard}
            headerOptions={(
                <IconButton
                    name={displayFullscreen ? "toggler-minimize" : "toggler-maximize"}
                    onClick={() => setDisplayFullscreen(!displayFullscreen)}
                />
            )}
            actions={[
                <Button data-test-id={"error-report-download-btn"} affirmative onClick={handleDownload} key="download">
                    {downloadButtonValue}
                </Button>,
                <Button data-test-id={"error-report-close-btn"} key="close" onClick={onDiscard}>
                    {closeButtonValue}
                </Button>,
            ]}
        >
            <HtmlContentBlock noScrollbarsOnChildren>
                {report}
            </HtmlContentBlock>
        </SimpleDialog>
    );
}
