import React, { useEffect, useState } from "react";

import { TestableComponent } from "../../components/interfaces";

export type ElapsedDateTimeDisplayUnits =
    | "second"
    | "seconds"
    | "minute"
    | "minutes"
    | "hour"
    | "hours"
    | "day"
    | "days";

export interface ElapsedDateTimeDisplayProps extends TestableComponent {
    // The date time given as string (parseable by Date) or number (ms since 1970-01-01 00:00:00 UTC)
    dateTime: string | number;
    // String to put before the elapsed time
    prefix?: string;
    // String to put after the elapsed time
    suffix?: string;
    // If the date time string should be shown as tooltip
    showDateTimeTooltip?: boolean;
    // Translate time related vocabulary
    translateUnits: (unit: ElapsedDateTimeDisplayUnits) => string;
    includeSeconds?: boolean;
}

const dateTimeToElapsedTimeInMs = (dateTime: string | number) => {
    const absoluteMs = typeof dateTime === "number" ? dateTime : new Date(dateTime).getTime();
    const elapsed = new Date().getTime() - absoluteMs;
    return elapsed < 0 ? 0 : elapsed;
};

/**
 * Returns a segmentation of the elapsed time, i.e. an array with the nr of days, hours, minutes, seconds
 */
const elapsedTimeSegmented = (elapsedTimeInMs: number): number[] => {
    // In how many segments the time should be split, i.e. hours, minutes, seconds
    const segmentSteps = [24, 60, 60];
    // First convert to time in seconds
    let remaining = Math.floor(elapsedTimeInMs / 1000);
    const segmentValues: number[] = [];
    segmentSteps.reverse().forEach((segmentSize) => {
        const segmentValue = remaining % segmentSize;
        remaining = Math.floor(remaining / segmentSize);
        segmentValues.push(segmentValue);
    });
    segmentValues.push(remaining);
    return segmentValues.reverse();
};

/**
 * Returns the simplified elapsed time
 */
const simplifiedElapsedTime = (
    timeSegments: number[],
    translateUnits: (unit: ElapsedDateTimeDisplayUnits) => string,
    includeSeconds = false
) => {
    const units: ElapsedDateTimeDisplayUnits[] = ["day", "hour", "minute"];

    if (includeSeconds) {
        units.push("second");
    }

    // Find first non-null value
    let idx = 0;
    while (idx < 3 && timeSegments[idx] === 0) {
        idx++;
    }

    if (idx === 3 && !includeSeconds) {
        // Do not show exact seconds
        return `< 1 ${translateUnits("minute")}`;
    } else {
        return `${timeSegments[idx]} ${translateUnits(
            (units[idx] + (timeSegments[idx] > 1 ? "s" : "")) as ElapsedDateTimeDisplayUnits
        )}`;
    }
};

/**
 * Displays the elapsed time in a human readable way.
 */
export const ElapsedDateTimeDisplay = ({
    dateTime,
    prefix = "",
    suffix = "",
    showDateTimeTooltip = true,
    translateUnits,
    includeSeconds,
    ...otherProps
}: ElapsedDateTimeDisplayProps) => {
    const [elapsedTime, setElapsedTime] = useState<number>(dateTimeToElapsedTimeInMs(dateTime));

    useEffect(() => {
        const timeout = setInterval(() => {
            setElapsedTime(dateTimeToElapsedTimeInMs(dateTime));
        }, 1000);
        return () => clearInterval(timeout);
    }, [dateTime]);

    return (
        <span
            data-test-id={otherProps["data-test-id"]}
            title={showDateTimeTooltip ? new Date(dateTime).toString() : ""}
        >
            {prefix + simplifiedElapsedTime(elapsedTimeSegmented(elapsedTime), translateUnits, includeSeconds) + suffix}
        </span>
    );
};

export const elapsedDateTimeDisplayUtils = {
    elapsedTimeSegmented,
    simplifiedElapsedTime,
};
