if (typeof window !== "undefined" && window.document) {
    window.document.body.createTextRange = function () {
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

// --- jsdom polyfills for Radix UI primitives (guarded) -----------------------------------------
// Radix relies on ResizeObserver, matchMedia, scrollIntoView, PointerEvent and pointer capture
// APIs that jsdom does not (fully) implement.

if (typeof global.ResizeObserver === "undefined") {
    global.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}

if (typeof window !== "undefined") {
    if (typeof window.matchMedia === "undefined") {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: (query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => {}, // deprecated
                removeListener: () => {}, // deprecated
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            }),
        });
    }

    if (typeof window.PointerEvent === "undefined") {
        window.PointerEvent = class PointerEvent extends MouseEvent {
            constructor(type, params = {}) {
                super(type, params);
                this.pointerId = params.pointerId ?? 0;
                this.width = params.width ?? 1;
                this.height = params.height ?? 1;
                this.pressure = params.pressure ?? 0;
                this.tangentialPressure = params.tangentialPressure ?? 0;
                this.tiltX = params.tiltX ?? 0;
                this.tiltY = params.tiltY ?? 0;
                this.twist = params.twist ?? 0;
                this.pointerType = params.pointerType ?? "mouse";
                this.isPrimary = params.isPrimary ?? false;
            }
        };
    }
}

if (typeof Element !== "undefined") {
    if (!Element.prototype.scrollIntoView) {
        Element.prototype.scrollIntoView = () => {};
    }
    if (!Element.prototype.hasPointerCapture) {
        Element.prototype.hasPointerCapture = () => false;
    }
    if (!Element.prototype.setPointerCapture) {
        Element.prototype.setPointerCapture = () => {};
    }
    if (!Element.prototype.releasePointerCapture) {
        Element.prototype.releasePointerCapture = () => {};
    }
}
