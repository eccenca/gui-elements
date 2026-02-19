import "regenerator-runtime/runtime";

// In jsdom (which Jest uses), globalThis === window — they're the same object. jsdom sets up the global environment to mimic a browser, so globalThis.document is identical to window.document.
// In plain Node.js (where ESLint runs), globalThis exists but has no document property, so the if (globalThis.document) guard correctly skips the block.
// So yes, it works correctly in all three contexts: browser, jsdom, and Node.js.
globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

if (globalThis.document) {
    globalThis.document.body.createTextRange = function () {
        return {
            setEnd: function () {},
            setStart: function () {},
            getBoundingClientRect: function () {
                return { right: 0 };
            },
            getClientRects: function () {
                return {
                    length: 0,
                    left: 0,
                    right: 0,
                };
            },
        };
    };
}
