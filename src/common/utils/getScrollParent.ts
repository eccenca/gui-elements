/**
 * Find the scroll parent of an element, returns `false` if it cannot be found.
 * In case of a `false` return the very probably `document.documentElement` is the parent.
 * In this case `window` object should be used for scroll event listeners.
 * See `src/components/Sticky/StickyTarget.tsx` for an usage example.
 * @param element
 * @returns HTMLElement | false
 */
export const getScrollParent = (element: Element): HTMLElement | false => {
    let scrollParent = element.parentElement;
    while (scrollParent) {
        const { overflow } = window.getComputedStyle(scrollParent);
        if (overflow.split(" ").every((value) => value === "auto" || value === "scroll")) {
            return scrollParent;
        }
        scrollParent = scrollParent.parentElement;
    }

    return false;
};
