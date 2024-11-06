export interface SilkActivityStatusProps {
    // Optional project ID
    project?: string;
    // Optional task ID
    task?: string;
    // The activity ID
    activity: string;
    // Human-readable activity label
    activityLabel: string;
    // If the activity is currently running
    isRunning: boolean;
    // If the activity has failed
    failed: boolean;
    // The name of the status class
    statusName: "Waiting" | "Finished" | "Idle" | "Running" | "Canceling";
    // A number between 0 and 100
    progress: number;
    // timestamp for last update
    lastUpdateTime: number;
    // More information corresponding to the status
    message: string;
    // If the activity has been cancelled
    cancelled: boolean;
    // The concrete status ID
    concreteStatus: SilkActivityStatusConcrete;
    // If there was an error, this contains the exception message
    exceptionMessage?: string | null;
    // The runtime in ms
    runtime?: number;
    // The start time as date time, e.g. "2021-09-07T09:34:53.153Z"
    startTime?: string;
    // The queue time spent waiting before workflow is executed as date time, e.g. "2021-09-07T09:34:53.153Z"
    queueTime?: string;
}

export type SilkActivityStatusConcrete =
    | "Cancelled"
    | "Failed"
    | "Successful"
    | "Not executed"
    | "Running"
    | "Waiting"
    | "Canceling";
