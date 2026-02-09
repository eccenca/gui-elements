import "regenerator-runtime/runtime";
import { TextEncoder, TextDecoder } from "util";

// Polyfill TextEncoder/TextDecoder for React 18
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


if (window.document) {
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
