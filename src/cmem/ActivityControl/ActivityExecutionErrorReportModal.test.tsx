import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SilkActivityControl, SilkActivityControlProps } from "./SilkActivityControl";

it("forwards the accessible name to a titleless activity error report", async () => {
    const failureReportAction = {
        title: "",
        "aria-label": "Activity execution error report",
        renderReport: () => <p>Error details</p>,
        renderMarkdown: true,
        fetchErrorReport: async () => "Error details",
        downloadButtonValue: "Download",
        closeButtonValue: "Close",
    };
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
        failureReportAction,
    };
    render(<SilkActivityControl {...props} />);
    fireEvent.click(screen.getByRole("button"));
    const dialog = await screen.findByRole("dialog", { name: "Activity execution error report" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.querySelector(".eccgui-card__title")).toBeEmptyDOMElement();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});
