import {TestableComponent} from "@gui-elements/src/components/interfaces";
import {
    ActivityControl,
    IActivityAction
} from "@gui-elements/src/components/dataIntegrationComponents/ActivityControl/ActivityControl";
import React, {useEffect, useState} from "react";
import {IActivityStatus} from "@gui-elements/src/components/dataIntegrationComponents/ActivityControl/ActivityControlTypes";
import {Intent} from "@blueprintjs/core/src/common/intent";
import {ActivityExecutionErrorReportModal} from "@gui-elements/src/components/dataIntegrationComponents/ActivityControl/ActivityExecutionErrorReportModal";

interface DataIntegrationActivityControlProps extends TestableComponent {
    // The label of this activity
    label: string
    // Initial state
    initialStatus?: IActivityStatus
    // Register a function in order to receive callbacks
    registerForUpdates: (callback: (status: IActivityStatus) => any) => any
    // Un-register this component from any updates
    unregisterFromUpdates: () => any
    // If the progress bar should be shown
    showProgress: boolean
    // If the start action should be available
    showStartAction: boolean
    // If the stop action should be available. Else actions can only be started, but not stopped.
    showStopAction: boolean
    // Allow display and download of activity execution failure reports
    failureReportAction?: IErrorReportAction
    // Show reload action, e.g. to refresh caches from scratch
    showReloadAction: boolean
    // Show 'View value' action, e.g. to check cache values
    showViewValueAction: boolean
    // DI activity actions
    executeActivityAction: (action: ActivityAction) => void
    // Get the translation for a specific key
    translate: (key: ActivityControlTranslationKeys) => string

}

interface IErrorReportAction {
    // The title of the error report modal
    title: string
    // The element that will be rendered in the modal, either as Markdown or object
    renderReport: (report: string | IActivityExecutionReport) => JSX.Element
    // What version of the report should be handed to the renderReport function, if false IActivityExecutionReport, if true the Markdown string
    renderMarkdown: boolean
    // The function to fetch the error report. It returns undefined if something went wrong.
    fetchErrorReport: (markdown: boolean) => Promise<string | IActivityExecutionReport | undefined>
    // If besides showing the error report, there should also be an option to download it.
    allowDownload?: boolean
    // The text of the download button in the modal
    downloadButtonValue: string
    // The text of the close button in the modal
    closeButtonValue: string
}

export interface IActivityExecutionReport {
    // Summary of the activity execution error
    errorSummary: string
    // If the activity was running in a project context, the project ID
    projectId?: string
    // If the activity was running in a task context, the task ID
    taskId?: string
    // The activity ID
    activityId: string
    // If the activity was running in a project context, the project label
    projectLabel?: string
    // If the activity was running in a task context, the task label
    taskLabel?: string
    // If the activity was running in a task context, the optional task description
    taskDescription?: string
    // The error message of the error/exception that has occurred
    errorMessage?: string
    // The stacktrace leading to the error
    stackTrace?: IStacktrace
}

interface IStacktrace {
    // The final error message of the stacktrace
    errorMessage?: String
    // The individual elements of the stack trace
    lines: string[]
    // In case of nested stacktraces this may contain the cause of the failure
    cause?: IStacktrace
}

export type ActivityControlTranslationKeys = "startActivity" | "stopActivity" | "reloadActivity" | "showErrorReport"

export type ActivityAction = "start" | "cancel" | "restart"

/** DataIntegration activity control. */
export function DataIntegrationActivityControl({
                                                   label,
                                                   initialStatus,
                                                   registerForUpdates,
                                                   executeActivityAction,
                                                   showReloadAction,
                                                   showStartAction,
                                                   showViewValueAction,
                                                   showStopAction,
                                                   failureReportAction,
                                                   showProgress,
                                                   unregisterFromUpdates,
                                                   translate,
                                                   ...props
                                               }: DataIntegrationActivityControlProps) {
    const [activityStatus, setActivityStatus] = useState<IActivityStatus | undefined>(initialStatus)
    const [errorReport, setErrorReport] = useState<string | IActivityExecutionReport | undefined>(undefined)
    const isRunning: boolean = !!activityStatus && activityStatus.isRunning

    // Register update function
    useEffect(() => {
        const updateActivityStatus = (status) => {
            setActivityStatus(status)
        }
        registerForUpdates(updateActivityStatus)
        return unregisterFromUpdates
    }, [])

    // Create activity actions
    const actions: IActivityAction[] = []
    if(showStartAction && !isRunning) {
        actions.push({
            "data-test-id": "activity-start-activity",
            icon: "activity-start",
            action: () => executeActivityAction("start"),
            tooltip: translate("startActivity")
        })
    }
    if(showStopAction && isRunning) {
        actions.push({
            "data-test-id": "activity-stop-activity",
            icon: "activity-stop",
            action: () => executeActivityAction("cancel"),
            tooltip: translate("stopActivity")
        })
    }
    if(showReloadAction) {
        actions.push({
            "data-test-id": "activity-reload-activity",
            icon: "activity-reload",
            action: () => executeActivityAction("restart"),
            tooltip: translate("reloadActivity")
        })
    }

    if(failureReportAction && activityStatus?.failed) {
        actions.push({
            "data-test-id": "activity-show-error-report",
            icon: "activity-error-report",
            action: () => showErrorReport(failureReportAction),
            tooltip: translate("showErrorReport")
        })
    }

    const showErrorReport = async (action: IErrorReportAction) => {
        const errorReport = await action.fetchErrorReport(action.renderMarkdown)
        setErrorReport(errorReport)
    }

    const closeErrorReport = () => {
        setErrorReport(undefined)
    }

    return <>
        <ActivityControl
            key={"activity-control"}
            data-test-id={props["data-test-id"]}
            label={label}
            progress={showProgress ? {
                value: activityStatus && (activityStatus.progress / 100),
                intent: activityStatus ? calcIntent(activityStatus) : "none"
            } : undefined
            }
            activityActions={actions}
            statusMessage={activityStatus?.message}
        />
        {errorReport && failureReportAction && <ActivityExecutionErrorReportModal
            title={failureReportAction.title}
            key={"error-report-modal"}
            closeButtonValue={failureReportAction.closeButtonValue}
            downloadButtonValue={failureReportAction.downloadButtonValue}
            fetchErrorReport={async () => {
                return await failureReportAction.fetchErrorReport(true) as (string | undefined)
            }}
            report={failureReportAction.renderReport(errorReport)}
            onDiscard={closeErrorReport}
        />}
    </>
}

const calcIntent = (activityStatus: IActivityStatus): Intent => {
    const concreteStatus = activityStatus.concreteStatus
    let intent: Intent
    switch(concreteStatus) {
        case "Running":
        case "Successful":
            intent = "success"
            break
        case "Cancelled":
        case "Canceling":
            intent = "warning"
            break
        case "Failed":
            intent = "danger"
            break
        case "Waiting":
            intent = "none" // TODO: This is 100% yellow in the old activity control
            break
        default:
            intent = "none"
    }
    return intent
}
