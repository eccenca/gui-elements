/**
 * Find the scroll parent of an element, returns `false` if it cannot be found.
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
