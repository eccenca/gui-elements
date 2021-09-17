import React, {useEffect, useState} from "react";
import {TestableComponent} from "@gui-elements/src/components/interfaces";

interface IProps extends TestableComponent {
    // The date time given as string (parseable by Date) or number (ms since 1970-01-01 00:00:00 UTC)
    dateTime: string | number
    // String to put before the elapsed time
    prefix?: string
    // String to put after the elapsed time
    suffix?: string
    // If the date time string should be shown as tooltip
    showDateTimeTooltip?: boolean
}

const dateTimeToElapsedTimeInMs = (dateTime: string | number) => {
    const absoluteMs = typeof dateTime === "number" ? dateTime : new Date(dateTime).getTime()
    return new Date().getTime() - absoluteMs
}

// Returns a human-readable string of the elapsed time
export const elapsedTimeHumanReadable = (elapsedTimeInMs: number): string => {
    // In how many segments the time should be split, i.e. hours, minutes, seconds
    const segmentSteps = [60, 60]
    // First convert to time in seconds
    let remaining = Math.floor(elapsedTimeInMs / 1000)
    const segmentValues: string[] = []
    segmentSteps.reverse().forEach((segmentSize) => {
        const segmentValue = remaining % segmentSize
        remaining =  Math.floor(remaining / segmentSize)
        const segmentWidth = ("" + (segmentSize - 1)).length
        const segmentValueWidth = ("" + (segmentValue)).length
        let zeroPadding = ""
        for(let i = segmentWidth - segmentValueWidth; i > 0;i--) {
            zeroPadding += "0"
        }
        segmentValues.push(zeroPadding + segmentValue)
    })
    if(remaining > 0) {
        segmentValues.push("" + remaining)
    }
    return segmentValues.reverse().join(":")
}

/** Displays the elapsed time in a human readable way. */
export const ElapsedDateTimeDisplay = ({dateTime, prefix = "", suffix = "", showDateTimeTooltip = true, ...otherProps}: IProps) => {
    const [elapsedTime, setElapsedTime] = useState<number>(dateTimeToElapsedTimeInMs(dateTime))

    useEffect(() => {
        const timeout = setInterval(() => {
            setElapsedTime(dateTimeToElapsedTimeInMs(dateTime))
        }, 1000)
        return () => clearInterval(timeout)
    }, [])

    return <span data-test-id={otherProps["data-test-id"]} title={showDateTimeTooltip ? new Date(dateTime).toString() : ""}>
        {prefix + elapsedTimeHumanReadable(elapsedTime) + suffix}
    </span>
}
