import {Button, HtmlContentBlock, SimpleDialog} from "@gui-elements/index";
import React from "react";

interface IProps {
    // Title of the modal
    title: string
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
    const handleDownload = async () => {
        const markdown = await fetchErrorReport()
        if(markdown) {
            const element = document.createElement("a");
            element.href = window.URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
            element.download = `${title}.md`;
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
            onClose={onDiscard}
            actions={[
                <Button affirmative onClick={handleDownload} key="download">
                    {downloadButtonValue}
                </Button>,
                <Button key="close" onClick={onDiscard}>
                    {closeButtonValue}
                </Button>,
            ]}
        >
            <HtmlContentBlock>
                {report}
            </HtmlContentBlock>
        </SimpleDialog>
    );
}
