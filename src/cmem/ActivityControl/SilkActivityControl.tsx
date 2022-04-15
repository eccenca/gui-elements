import { TestableComponent } from "../../components/interfaces";
import { ActivityControlWidget, IActivityAction } from "./ActivityControlWidget";
import React, { useEffect, useState } from "react";
import { IActivityStatus } from "./ActivityControlTypes";
import { Intent } from "@blueprintjs/core/src/common/intent";
import { ActivityExecutionErrorReportModal } from "./ActivityExecutionErrorReportModal";
import { Icon, Spacing } from "../../../index";
import { ElapsedDateTimeDisplay, TimeUnits } from "../DateTimeDisplay/ElapsedDateTimeDisplay";
import { IntentTypes } from "src/common/Intent";

const progressBreakpointIndetermination = 10;
const progressBreakpointAnimation = 99;

interface SilkActivityControlProps extends TestableComponent {
    // The label of this activity
    label: string | JSX.Element;
    /**
     * To add tags in addition to the widget status description
     */
    tags?: JSX.Element;
    // Initial state
    initialStatus?: IActivityStatus;
    // Register a function in order to receive callbacks
    registerForUpdates: (callback: (status: IActivityStatus) => any) => any;
    // Un-register this component from any updates
    unregisterFromUpdates: () => any;
    // If the start action should be available
    showStartAction: boolean;
    // If the stop action should be available. Else actions can only be started, but not stopped.
    showStopAction: boolean;
    // Allow display and download of activity execution failure reports
    failureReportAction?: IErrorReportAction;
    // Show reload action, e.g. to refresh caches from scratch
    showReloadAction: boolean;
    // If defined, shows the 'View value' action, e.g. to check cache values
    viewValueAction?: {
        // Tooltip to show on icon button
        tooltip?: string;
        // The action, either a URL that will be opened in a new tab or a callback function
        action: string | (() => any);
    };
    // DI activity actions
    executeActivityAction: (action: ActivityAction) => void;
    // Get the translation for a specific key
    translate: (key: ActivityControlTranslationKeys) => string;
    // When defined the elapsed time since the last start is displayed next to the label
    elapsedTimeOfLastStart?: {
        // Prefix before the elapsed time
        prefix?: string;
        // Suffix after the elapsed time
        suffix?: string;
        // The translation of the time units
        translate: (unit: TimeUnits) => string;
    };
    // configure how the widget is displayed
    layoutConfig?: IActivityControlLayoutProps;
}

export interface IActivityControlLayoutProps {
    // show small version of the widget
    small?: boolean;
    // display widget inside rectange
    border?: boolean;
    // only use necessary width, not always the available 100% of parent element
    canShrink?: boolean;
    // what type of progrss display should be uses, horizontal progress bar, circular spinner, or none of that
    visualization?: "none" | "progressbar" | "spinner";
}

const defaultLayout: IActivityControlLayoutProps = {
    small: false,
    border: false,
    canShrink: false,
    visualization: "spinner",
};

interface IErrorReportAction {
    // The title of the error report modal
    title?: string;
    // The element that will be rendered in the modal, either as Markdown or object
    renderReport: (report: string | IActivityExecutionReport) => JSX.Element;
    // What version of the report should be handed to the renderReport function, if false IActivityExecutionReport, if true the Markdown string
    renderMarkdown: boolean;
    // The function to fetch the error report. It returns undefined if something went wrong.
    fetchErrorReport: (markdown: boolean) => Promise<string | IActivityExecutionReport | undefined>;
    // If besides showing the error report, there should also be an option to download it.
    allowDownload?: boolean;
    // The text of the download button in the modal
    downloadButtonValue: string;
    // The text of the close button in the modal
    closeButtonValue: string;
}

export interface IActivityExecutionReport {
    // Summary of the activity execution error
    errorSummary: string;
    // If the activity was running in a project context, the project ID
    projectId?: string;
    // If the activity was running in a task context, the task ID
    taskId?: string;
    // The activity ID
    activityId: string;
    // If the activity was running in a project context, the project label
    projectLabel?: string;
    // If the activity was running in a task context, the task label
    taskLabel?: string;
    // If the activity was running in a task context, the optional task description
    taskDescription?: string;
    // The error message of the error/exception that has occurred
    errorMessage?: string;
    // The stacktrace leading to the error
    stackTrace?: IStacktrace;
}

interface IStacktrace {
    // The final error message of the stacktrace
    errorMessage?: String;
    // The individual elements of the stack trace
    lines: string[];
    // In case of nested stacktraces this may contain the cause of the failure
    cause?: IStacktrace;
}

export type ActivityControlTranslationKeys = "startActivity" | "stopActivity" | "reloadActivity" | "showErrorReport";

export type ActivityAction = "start" | "cancel" | "restart";

/** Silk activity control. */
export function SilkActivityControl({
    label,
    initialStatus,
    registerForUpdates,
    executeActivityAction,
    showReloadAction,
    showStartAction,
    viewValueAction,
    showStopAction,
    failureReportAction,
    unregisterFromUpdates,
    translate,
    elapsedTimeOfLastStart,
    tags,
    layoutConfig = defaultLayout,
    ...props
}: SilkActivityControlProps) {
    const [activityStatus, setActivityStatus] = useState<IActivityStatus | undefined>(initialStatus);
    const [errorReport, setErrorReport] = useState<string | IActivityExecutionReport | undefined>(undefined);

    // Register update function
    useEffect(
        () => {
            const updateActivityStatus = (status) => {
                setActivityStatus(status);
            };
            registerForUpdates(updateActivityStatus);
            return unregisterFromUpdates;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // Create activity actions
    const actions: IActivityAction[] = [];

    if (failureReportAction && activityStatus?.failed && activityStatus.concreteStatus !== "Cancelled") {
        actions.push({
            "data-test-id": "activity-show-error-report",
            icon: "artefact-report",
            action: () => showErrorReport(failureReportAction),
            tooltip: translate("showErrorReport"),
            hasStateWarning: true,
        });
    }

    if (showStartAction) {
        actions.push({
            "data-test-id": "activity-start-activity",
            icon: "item-start",
            action: () => executeActivityAction("start"),
            tooltip: translate("startActivity"),
            disabled: activityStatus?.isRunning === true,
        });
    }

    if (showReloadAction) {
        actions.push({
            "data-test-id": "activity-reload-activity",
            icon: "item-reload",
            action: () => executeActivityAction("restart"),
            tooltip: translate("reloadActivity"),
            disabled: activityStatus?.isRunning === true,
        });
    }

    if (showStopAction) {
        actions.push({
            "data-test-id": "activity-stop-activity",
            icon: "item-stop",
            action: () => executeActivityAction("cancel"),
            tooltip: translate("stopActivity"),
            disabled: activityStatus?.isRunning === false,
        });
    }

    if (viewValueAction && activityStatus?.concreteStatus !== "Not executed") {
        const action: () => any =
            typeof viewValueAction.action === "string"
                ? () => {
                      window.open(viewValueAction.action as string, "_blank");
                  }
                : viewValueAction.action;
        actions.push({
            "data-test-id": "activity-view-data",
            icon: "artefact-rawdata",
            action,
            tooltip: viewValueAction.tooltip,
        });
    }

    const showErrorReport = async (action: IErrorReportAction) => {
        const errorReport = await action.fetchErrorReport(action.renderMarkdown);
        setErrorReport(errorReport);
    };

    const closeErrorReport = () => {
        setErrorReport(undefined);
    };

    const activityControlLabel =
        activityStatus?.startTime && elapsedTimeOfLastStart ? (
            <>
                {label}
                <Spacing vertical={true} size="tiny" />
                <ElapsedDateTimeDisplay
                    dateTime={activityStatus.startTime}
                    prefix={elapsedTimeOfLastStart.prefix}
                    suffix={elapsedTimeOfLastStart.suffix}
                    translateUnits={elapsedTimeOfLastStart.translate}
                />
            </>
        ) : (
            <>{label}</>
        );

    const { visualization, ...otherLayoutConfig } = layoutConfig;
    let visualizationProps = {}; // visualization==="none" or undefined
    const runningProgress = activityStatus && activityStatus.isRunning;
    const waitingProgress = activityStatus && activityStatus.concreteStatus === "Waiting";
    const animateProgress =
        activityStatus && activityStatus.progress > 0 && activityStatus.progress < progressBreakpointAnimation;
    const indeterminateProgress = activityStatus && activityStatus.progress < progressBreakpointIndetermination;
    const intent = activityStatus ? calcIntent(activityStatus) : "none";

    if (visualization === "progressbar") {
        visualizationProps = {
            progressBar: {
                animate: waitingProgress || (runningProgress && animateProgress),
                stripes: waitingProgress || (runningProgress && animateProgress),
                value:
                    waitingProgress || (runningProgress && indeterminateProgress)
                        ? undefined
                        : activityStatus && activityStatus.progress > 0
                        ? activityStatus.progress / 100
                        : 0,
                intent,
            },
        };
    }
    if (visualization === "spinner") {
        visualizationProps = {
            progressSpinner: {
                value:
                    waitingProgress || (runningProgress && indeterminateProgress)
                        ? undefined
                        : activityStatus && activityStatus.progress > 0
                        ? activityStatus.progress / 100
                        : 0,
                intent,
            },
        };
    }

    if (activityStatus?.statusName === "Finished") {
        visualizationProps = {
            ...visualizationProps,
            progressSpinnerFinishedIcon: <Icon name={`state-${intent}`} intent={intent as IntentTypes} />,
        };
    }

    return (
        <>
            <ActivityControlWidget
                key={"activity-control"}
                tags={tags}
                data-test-id={props["data-test-id"]}
                label={activityControlLabel}
                activityActions={actions}
                statusMessage={activityStatus?.message}
                {...visualizationProps}
                {...otherLayoutConfig}
            />
            {errorReport && failureReportAction && (
                <ActivityExecutionErrorReportModal
                    title={failureReportAction.title}
                    key={"error-report-modal"}
                    closeButtonValue={failureReportAction.closeButtonValue}
                    downloadButtonValue={failureReportAction.downloadButtonValue}
                    fetchErrorReport={async () => {
                        return (await failureReportAction.fetchErrorReport(true)) as string | undefined;
                    }}
                    report={failureReportAction.renderReport(errorReport)}
                    onDiscard={closeErrorReport}
                />
            )}
        </>
    );
}

export const calcIntent = (activityStatus: IActivityStatus): Intent => {
    const concreteStatus = activityStatus.concreteStatus;
    let intent: Intent;
    switch (concreteStatus) {
        case "Running":
        case "Successful":
            intent = "success";
            break;
        case "Cancelled":
        case "Canceling":
            intent = "warning";
            break;
        case "Failed":
            intent = "danger";
            break;
        case "Waiting":
            intent = "none"; // TODO: This is 100% yellow in the old activity control
            break;
        default:
            intent = "none";
    }
    return intent;
};
