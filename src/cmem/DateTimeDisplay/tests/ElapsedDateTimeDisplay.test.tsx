import { ElapsedDateTimeDisplayUnits, elapsedDateTimeDisplayUtils } from "../../../../index";

describe("Elapsed time component", () => {
    const checkMS = (timeInMs: number, expectedString: string) =>
        expect(elapsedDateTimeDisplayUtils.elapsedTimeSegmented(timeInMs).join(":")).toBe(expectedString);
    const checkS = (timeInSeconds: number, expectedString: string) => checkMS(timeInSeconds * 1000, expectedString);
    const translate = (timeUnit: ElapsedDateTimeDisplayUnits) => timeUnit;
    const checkHumanReadable = (timeInSeconds: number, expectedString: string) =>
        expect(
            elapsedDateTimeDisplayUtils.simplifiedElapsedTime(
                elapsedDateTimeDisplayUtils.elapsedTimeSegmented(timeInSeconds * 1000),
                translate
            )
        ).toBe(expectedString);
    it("should segment the time", () => {
        checkMS(2123, "0:0:0:2");
        checkS(2, "0:0:0:2");
        checkS(12, "0:0:0:12");
        checkS(62, "0:0:1:2");
        checkS(72, "0:0:1:12");
        checkS(10 * 60, "0:0:10:0");
        checkS(10 * 60 + 2, "0:0:10:2");
        checkS(3600 * 123 + 60 * 42 + 23, "5:3:42:23");
    });
    it("should return a human-readable representation of the time", () => {
        checkHumanReadable(2, "< 1 minute");
        checkHumanReadable(59, "< 1 minute");
        checkHumanReadable(60, "1 minute");
        checkHumanReadable(2 * 60, "2 minutes");
        checkHumanReadable(3600, "1 hour");
        checkHumanReadable(3600 + 1, "1 hour");
        checkHumanReadable(2 * 3600, "2 hours");
        checkHumanReadable(24 * 3600, "1 day");
        checkHumanReadable(2 * 24 * 3600 + 123, "2 days");
    });
});
