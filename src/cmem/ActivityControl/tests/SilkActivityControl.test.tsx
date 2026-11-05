import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import "@testing-library/jest-dom";

import { ActivityExecutionErrorReportModal } from "../ActivityExecutionErrorReportModal";
import { SilkActivityControl, SilkActivityControlProps } from "../SilkActivityControl";

type FailureReportAction = NonNullable<SilkActivityControlProps["failureReportAction"]>;

const renderFailedActivity = (
    failureReportAction: Partial<FailureReportAction>,
    additionalContent?: React.ReactNode,
) => {
    const props: SilkActivityControlProps = {
        label: "Execution",
        initialStatus: {
            activity: "execute",
            activityLabel: "Execution",
            isRunning: false,
            failed: true,
            statusName: "Finished",
            progress: 100,
            lastUpdateTime: 0,
            message: "Failed",
            cancelled: false,
            concreteStatus: "Failed",
        },
        registerForUpdates: jest.fn(),
        unregisterFromUpdates: jest.fn(),
        showStartAction: false,
        showStopAction: false,
        showReloadAction: false,
        executeActivityAction: jest.fn(),
        translate: (key) => key,
        failureReportAction: {
            renderReport: () => <p>Error details</p>,
            renderMarkdown: true,
            fetchErrorReport: async () => "Error details",
            downloadButtonValue: "Download",
            closeButtonValue: "Close",
            ...failureReportAction,
        },
    };
    const utils = render(
        <>
            {additionalContent}
            <SilkActivityControl {...props} />
        </>,
    );
    const openErrorReport = () =>
        fireEvent.click(utils.container.querySelector("[data-test-id='activity-show-error-report']") as HTMLElement);
    return { ...utils, openErrorReport };
};

describe("SilkActivityControl error report", () => {
    it("uses the title as accessible name of the error report dialog", async () => {
        const { openErrorReport } = renderFailedActivity({ title: "Error report" });
        openErrorReport();
        expect(await screen.findByRole("dialog", { name: "Error report" })).toHaveAttribute("aria-modal", "true");
    });

    it("forwards `aria-label` to a titleless error report dialog", async () => {
        const { openErrorReport } = renderFailedActivity({
            title: "",
            "aria-label": "Activity execution error report",
        });
        openErrorReport();
        const dialog = await screen.findByRole("dialog", { name: "Activity execution error report" });
        expect(dialog).toHaveAttribute("aria-modal", "true");

        fireEvent.click(screen.getByRole("button", { name: "Close" }));
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("uses the translated `showErrorReport` text as fallback name for a titleless error report dialog", async () => {
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
        const { openErrorReport } = renderFailedActivity({ title: "" });
        openErrorReport();
        expect(await screen.findByRole("dialog", { name: "showErrorReport" })).toHaveAttribute("aria-modal", "true");
        expect(warnSpy).not.toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it("forwards the full screen toggler texts to the error report dialog", async () => {
        const { openErrorReport } = renderFailedActivity({
            title: "Error report",
            fullScreenTogglerTexts: { maximize: "Vollbild anzeigen", minimize: "Vollbild verlassen" },
        });
        openErrorReport();
        const dialog = await screen.findByRole("dialog", { name: "Error report" });
        const toggler = within(dialog).getByRole("button", { name: "Vollbild anzeigen" });

        fireEvent.click(toggler);
        expect(toggler).toHaveAccessibleName("Vollbild verlassen");
    });

    it("forwards `aria-labelledby` to a titleless error report dialog", async () => {
        const { openErrorReport } = renderFailedActivity(
            { "aria-labelledby": "external-report-label" },
            <span id="external-report-label">Referenced error report label</span>,
        );
        openErrorReport();
        const dialog = await screen.findByRole("dialog", { name: "Referenced error report label" });
        expect(dialog).toHaveAttribute("aria-labelledby", "external-report-label");
    });
});

describe("ActivityExecutionErrorReportModal", () => {
    it("uses an english fallback name if neither title nor aria attributes are given", () => {
        render(
            <ActivityExecutionErrorReportModal
                onDiscard={jest.fn()}
                report={<p>Error details</p>}
                downloadButtonValue="Download"
                closeButtonValue="Close"
                fetchErrorReport={async () => "Error details"}
            />,
        );
        expect(screen.getByRole("dialog", { name: "Activity execution error report" })).toBeInTheDocument();
    });
});
