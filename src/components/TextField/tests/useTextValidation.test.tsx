import React from "react";
import { act,render } from "@testing-library/react";

import { useTextValidation } from "../useTextValidation";

const HookWrapper: React.FC<{ value: string; callback: jest.Mock; callbackDelay?: number }> = ({
    value,
    callback,
    callbackDelay = 0,
}) => {
    useTextValidation({
        value,
        onChange: jest.fn(),
        invisibleCharacterWarning: { callback, callbackDelay },
    });
    return null;
};

describe("useTextValidation", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    /** Render the hook with a controlled value and flush the debounce timer. */
    const runWithValue = (value: string, callbackDelay = 0) => {
        const callback = jest.fn();
        render(<HookWrapper value={value} callback={callback} callbackDelay={callbackDelay} />);
        act(() => {
            jest.runAllTimers();
        });
        return callback;
    };

    describe("invisible character detection", () => {
        it("reports empty set for plain text", () => {
            const callback = runWithValue("hello world");
            expect(callback).toHaveBeenCalledWith(new Set());
        });

        it("detects zero-width space (U+200B)", () => {
            const callback = runWithValue("hello\u200Bworld");
            expect(callback).toHaveBeenCalledWith(new Set([0x200b]));
        });

        it("detects zero-width non-joiner (U+200C)", () => {
            const callback = runWithValue("hello\u200Cworld");
            expect(callback).toHaveBeenCalledWith(new Set([0x200c]));
        });
    });

    describe("emoji false-positive prevention", () => {
        it("does not flag ✔️ (base char + variation selector U+FE0F)", () => {
            const callback = runWithValue("✔️");
            expect(callback).toHaveBeenCalledWith(new Set());
        });

        it("does not flag ZWJ sequence emoji 👨‍👩‍👧‍👦", () => {
            const callback = runWithValue("👨‍👩‍👧‍👦");
            expect(callback).toHaveBeenCalledWith(new Set());
        });

        it("does not flag tag-based flag emoji 🏴󠁧󠁢󠁥󠁮󠁧󠁿", () => {
            const callback = runWithValue("🏴󠁧󠁢󠁥󠁮󠁧󠁿");
            expect(callback).toHaveBeenCalledWith(new Set());
        });

        it("does not flag keycap emoji #️⃣", () => {
            const callback = runWithValue("#️⃣");
            expect(callback).toHaveBeenCalledWith(new Set());
        });
    });

    describe("mixed content", () => {
        it("detects ZWS while ignoring surrounding emoji", () => {
            const callback = runWithValue("Check\u200B ✔️ 👨‍👩‍👧‍👦 🏴󠁧󠁢󠁥󠁮󠁧󠁿 #️⃣");
            expect(callback).toHaveBeenCalledWith(new Set([0x200b]));
        });

        it("reports empty set for text with only emoji", () => {
            const callback = runWithValue("✔️ 👨‍👩‍👧‍👦 🏴󠁧󠁢󠁥󠁮󠁧󠁿 #️⃣");
            expect(callback).toHaveBeenCalledWith(new Set());
        });
    });
});
