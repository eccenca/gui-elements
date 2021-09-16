import {elapsedTimeHumanReadable} from "../ElapsedDateTimeDisplay";

describe("Elapsed time component", () => {
    const checkMS = (timeInMs: number, expectedString: string) => expect(elapsedTimeHumanReadable(timeInMs)).toBe(expectedString)
    const checkS = (timeInSeconds: number, expectedString: string) => checkMS(timeInSeconds * 1000, expectedString)
    it("should display human-readable time", () => {
        checkMS(2123, "00:02")
        checkS(2, "00:02")
        checkS(12, "00:12")
        checkS(62, "01:02")
        checkS(72, "01:12")
        checkS(10*60, "10:00")
        checkS(10*60 + 2, "10:02")
        checkS(3600 * 123 + 60 * 42 + 23, "123:42:23")
    })
})
