import React, { useEffect, useRef, useState } from "react";
import { Intent } from "@blueprintjs/core/src/common/intent";

import { Icon, Spacing } from "../../";
import { IntentTypes } from "../../common/Intent";
import { TestableComponent } from "../../components/interfaces";
import { ElapsedDateTimeDisplay, ElapsedDateTimeDisplayUnits } from "../DateTimeDisplay/ElapsedDateTimeDisplay";

import { SilkActivityStatusConcrete, SilkActivityStatusProps } from "./ActivityControlTypes";
import { ActivityControlWidget, ActivityControlWidgetProps } from "./ActivityControlWidget";
import { ActivityExecutionErrorReportModal } from "./ActivityExecutionErrorReportModal";

const progressBreakpointIndetermination = 10;
const progressBreakpointAnimation = 99;

export interface SilkActivityControlProps extends TestableComponent {
    // The label of this activity
    label: string | JSX.Element;
    /**
     * To add tags in addition to the widget status description
     */
    tags?: JSX.Element;
    // Initial state
    initialStatus?: SilkActivityStatusProps;
    // Register a function in order to receive callbacks
    registerForUpdates: (callback: (status: SilkActivityStatusProps) => any) => any;
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
    executeActivityAction: (action: SilkActivityControlAction) => void;
    /** If specified, the activity control will offer a "Start prioritized" button while the activity is in the waiting state.
     * When the button is clicked it should start the activity via the startPrioritized endpoint.
     */
    executePrioritized?: () => void;
    // Get the translation for a specific key
    translate: (key: SilkActivityControlTranslationKeys) => string;
    // When defined the elapsed time since the last start is displayed next to the label
    elapsedTimeOfLastStart?: {
        // Prefix before the elapsed time
        prefix?: string;
        // Suffix after the elapsed time
        suffix?: string;
        // The translation of the time units
        translate: (unit: ElapsedDateTimeDisplayUnits) => string;
    };
    // configure how the widget is displayed
    layoutConfig?: SilkActivityControlLayoutProps;
    /** Configures when the status message should be hidden, e.g. because it is uninteresting. */
    hideMessageOnStatus?: (concreteStatus: SilkActivityStatusConcrete | undefined) => boolean;
    /**
     * The translation of the time units
     */
    translateUnits?: (unit: ElapsedDateTimeDisplayUnits) => string;
}

export interface SilkActivityControlLayoutProps {
    // show small version of the widget
    small?: boolean;
    // display widget inside rectange
    border?: boolean;
    // add a bit spacing
    hasSpacing?: boolean;
    // only use necessary width, not always the available 100% of parent element
    canShrink?: boolean;
    // what type of progrss display should be uses, horizontal progress bar, circular spinner, or none of that
    visualization?: "none" | "progressbar" | "spinner";
    // wrapper around label
    labelWrapper?: JSX.Element;
}

const defaultLayout: SilkActivityControlLayoutProps = {
    small: false,
    border: false,
    canShrink: false,
    visualization: "spinner",
};

interface IErrorReportAction {
    // The title of the error report modal
    title?: string;
    // The element that will be rendered in the modal, either as Markdown or object
    renderReport: (report: string | SilkActivityExecutionReportProps) => JSX.Element;
    // What version of the report should be handed to the renderReport function, if false SilkActivityExecutionReportProps, if true the Markdown string
    renderMarkdown: boolean;
    // The function to fetch the error report. It returns undefined if something went wrong.
    fetchErrorReport: (markdown: boolean) => Promise<string | SilkActivityExecutionReportProps | undefined>;
    // If besides showing the error report, there should also be an option to download it.
    allowDownload?: boolean;
    // The text of the download button in the modal
    downloadButtonValue: string;
    // The text of the close button in the modal
    closeButtonValue: string;
}

export interface SilkActivityExecutionReportProps {
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
    errorMessage?: string;
    // The individual elements of the stack trace
    lines: string[];
    // In case of nested stacktraces this may contain the cause of the failure
    cause?: IStacktrace;
}

export type SilkActivityControlTranslationKeys =
    | "startActivity"
    | "stopActivity"
    | "reloadActivity"
    | "showErrorReport"
    | "startPrioritized";
export type SilkActivityControlAction = "start" | "cancel" | "restart";

/** Silk activity control. */
export function SilkActivityControl(props: SilkActivityControlProps) {
    const { widget } = useSilkActivityControl(props);
    return widget;
}

export function useSilkActivityControl({
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
    hideMessageOnStatus = () => false,
    executePrioritized,
    translateUnits = (unit: ElapsedDateTimeDisplayUnits) => unit.toString(),
    ...props
}: SilkActivityControlProps) {
    const [activityStatus, setActivityStatus] = useState<SilkActivityStatusProps | undefined>(initialStatus);
    const currentStatus = useRef<SilkActivityStatusProps | undefined>(initialStatus);
    const [showStartPrioritized, setShowStartPrioritized] = useState(false);
    const [errorReport, setErrorReport] = useState<string | SilkActivityExecutionReportProps | undefined>(undefined);

    // Register update function
    useEffect(
        () => {
            const updateActivityStatus = (status: SilkActivityStatusProps | undefined) => {
                if (status?.concreteStatus !== "Waiting") {
                    setShowStartPrioritized(false);
                } else if (executePrioritized) {
                    // Show start prioritized button only-if the activity is still in Waiting status after 2s
                    setTimeout(() => {
                        if (currentStatus.current?.concreteStatus === "Waiting") {
                            setShowStartPrioritized(true);
                        }
                    }, 2000);
                }
                currentStatus.current = status;
                setActivityStatus(status);
            };
            registerForUpdates(updateActivityStatus);
            return unregisterFromUpdates;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // Create activity actions
    const actions: ActivityControlWidgetProps["activityActions"] = [];

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
        if (showStartPrioritized && executePrioritized) {
            actions.push({
                "data-test-id": "activity-start-prioritized-activity",
                icon: "item-skip-forward",
                action: executePrioritized,
                tooltip: translate("startPrioritized"),
            });
        } else {
            actions.push({
                "data-test-id": "activity-start-activity",
                icon: "item-start",
                action: () => executeActivityAction("start"),
                tooltip: translate("startActivity"),
                disabled: activityStatus?.isRunning === true,
            });
        }
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
            label
        );

    const timerExecutionMessage =
        (activityStatus?.startTime || activityStatus?.queueTime) && activityStatus.statusName !== "Finished" ? (
            <ElapsedDateTimeDisplay
                includeSeconds
                dateTime={
                    (activityStatus.statusName === "Running"
                        ? activityStatus?.startTime
                        : activityStatus.statusName === "Waiting"
                        ? activityStatus.queueTime
                        : activityStatus?.startTime)!
                }
                translateUnits={translateUnits}
            />
        ) : null;

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

    if (activityStatus?.statusName === "Finished" && intent !== "none" && intent !== "primary") {
        visualizationProps = {
            ...visualizationProps,
            progressSpinnerFinishedIcon: <Icon name={[`state-${intent}`]} intent={intent as IntentTypes} />,
        };
    }

    const widget = (
        <>
            <ActivityControlWidget
                key={"activity-control"}
                tags={tags}
                data-test-id={props["data-test-id"]}
                label={activityControlLabel}
                activityActions={actions}
                timerExecutionMsg={timerExecutionMessage}
                statusMessage={
                    hideMessageOnStatus(activityStatus?.concreteStatus) ? undefined : activityStatus?.message
                }
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

    return {
        elapsedDateTime:
            activityStatus?.startTime && elapsedTimeOfLastStart ? (
                <ElapsedDateTimeDisplay
                    dateTime={activityStatus.startTime}
                    translateUnits={elapsedTimeOfLastStart.translate}
                />
            ) : (
                <></>
            ),
        intent,
        widget,
    } as const;
}

export const calcIntent = (activityStatus: SilkActivityStatusProps): Intent => {
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
            intent = "none";
            break;
        default:
            intent = "none";
    }
    return intent;
};
