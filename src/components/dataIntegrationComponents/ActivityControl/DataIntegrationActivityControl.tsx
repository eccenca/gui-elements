import {TestableComponent} from "@gui-elements/src/components/interfaces";
import {
    ActivityControl,
    IActivityAction
} from "@gui-elements/src/components/dataIntegrationComponents/ActivityControl/ActivityControl";
import React, {useEffect, useState} from "react";
import {IActivityStatus} from "@gui-elements/src/components/dataIntegrationComponents/ActivityControl/ActivityControlTypes";
import {Intent} from "@blueprintjs/core/src/common/intent";

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
    // Allow failure report action
    showFailureReportAction: boolean
    // Show reload action, e.g. to refresh caches from scratch
    showReloadAction: boolean
    // Show 'View value' action, e.g. to check cache values
    showViewValueAction: boolean
    // DI activity actions
    executeActivityAction: (action: ActivityAction) => void
    // Get the translation for a specific key
    translate: (key: ActivityControlTranslationKeys) => string

}

export type ActivityControlTranslationKeys = "startActivity" | "stopActivity" | "reloadActivity"

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
                                                   showFailureReportAction,
                                                   showProgress,
                                                   unregisterFromUpdates,
                                                   translate,
                                                   ...props
                                               }: DataIntegrationActivityControlProps) {
    const [activityStatus, setActivityStatus] = useState<IActivityStatus | undefined>(initialStatus)
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

    return <ActivityControl
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
