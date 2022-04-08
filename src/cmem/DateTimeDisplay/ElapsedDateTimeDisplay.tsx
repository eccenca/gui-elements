import React, {useEffect, useState} from "react";
import {TestableComponent} from "../../components/interfaces";

interface IProps extends TestableComponent {
    // The date time given as string (parseable by Date) or number (ms since 1970-01-01 00:00:00 UTC)
    dateTime: string | number
    // String to put before the elapsed time
    prefix?: string
    // String to put after the elapsed time
    suffix?: string
    // If the date time string should be shown as tooltip
    showDateTimeTooltip?: boolean
    // Translate time related vocabulary
    translateUnits: (unit: TimeUnits) => string
}

export type TimeUnits = "minute" | "minutes" | "hour" | "hours" | "day" | "days"

const dateTimeToElapsedTimeInMs = (dateTime: string | number) => {
    const absoluteMs = typeof dateTime === "number" ? dateTime : new Date(dateTime).getTime()
    return new Date().getTime() - absoluteMs
}

// Returns a segmentation of the elapsed time, i.e. an array with the nr of days, hours, minutes, seconds
export const elapsedTimeSegmented = (elapsedTimeInMs: number): number[] => {
    // In how many segments the time should be split, i.e. hours, minutes, seconds
    const segmentSteps = [24, 60, 60]
    // First convert to time in seconds
    let remaining = Math.floor(elapsedTimeInMs / 1000)
    const segmentValues: number[] = []
    segmentSteps.reverse().forEach((segmentSize) => {
        const segmentValue = remaining % segmentSize
        remaining =  Math.floor(remaining / segmentSize)
        segmentValues.push(segmentValue)
    })
    segmentValues.push(remaining)
    return segmentValues.reverse()
}

// Returns the simplified elapsed time
export const simplifiedElapsedTime = (timeSegments: number[], translateUnits: (unit: TimeUnits) => string) => {
    const units: TimeUnits[] = ["day", "hour", "minute"]
    // Find first non-null value
    let idx = 0
    while(idx < 3 && timeSegments[idx] === 0) {
        idx++
    }
    if(idx === 3) {
        // Do not show exact seconds
        return `< 1 ${translateUnits("minute")}`
    } else {
        return `${timeSegments[idx]} ${translateUnits(units[idx] + (timeSegments[idx] > 1 ? "s": "") as TimeUnits)}`
    }
}
/** Displays the elapsed time in a human readable way. */
export const ElapsedDateTimeDisplay = ({dateTime, prefix = "", suffix = "", showDateTimeTooltip = true, translateUnits, ...otherProps}: IProps) => {
    const [elapsedTime, setElapsedTime] = useState<number>(dateTimeToElapsedTimeInMs(dateTime))

    useEffect(() => {
        const timeout = setInterval(() => {
            setElapsedTime(dateTimeToElapsedTimeInMs(dateTime))
        }, 1000)
        return () => clearInterval(timeout)
    }, [dateTime])

    return <span data-test-id={otherProps["data-test-id"]} title={showDateTimeTooltip ? new Date(dateTime).toString() : ""}>
        {prefix + simplifiedElapsedTime(elapsedTimeSegmented(elapsedTime), translateUnits) + suffix}
    </span>
}
