import React from "react";

export interface ModalContextProps {
    /** Set that a specific modal is currently being open (or closed) */
    setModalOpen: (modalId: string, isOpen: boolean) => void;

    /** The currently opened modals ordered by when they have been opened. Oldest coming first. */
    openModalStack(): string[] | undefined;
}

/** Used as long as no `ModalContext` is provided by the application, it does not track anything. */
const unprovidedModalContext: ModalContextProps = {
    setModalOpen: () => {},
    openModalStack: () => [],
};

/** Can be provided in the application to react to modal related changes. */
export const ModalContext = React.createContext<ModalContextProps>(unprovidedModalContext);

/** Checks if the given modal context is provided by the application, so it really tracks open modals.
 * Without a provided context the modals cannot know about each other.
 **/
export const isModalContextProvided = (modalContext: ModalContextProps): boolean =>
    modalContext !== unprovidedModalContext;

/** Calculates the stack of open modals after a modal was opened or closed.
 * Returns the given stack unchanged if it is not affected.
 **/
const updatedOpenModalStack = (stack: string[], modalId: string, isOpen: boolean): string[] => {
    if (isOpen) {
        // an already registered modal must not be added twice, otherwise closing it would
        // leave a stale entry in the stack
        return stack.includes(modalId) ? stack : [...stack, modalId];
    }

    if (!stack.includes(modalId)) {
        // Trying to close modal that has not been registered as open!
        return stack;
    }

    // Only the closed modal is removed. Modals that were opened after it are still open, e.g. a dialog that
    // opened a follow-up dialog and closed itself afterwards. They report their own closing, also when they
    // are unmounted. Removing them here would let the visible top most modal lose `aria-modal`.
    return stack.filter((id) => id !== modalId);
};

/** Default implementation for modal context props.
 * Tracks open modals in a stack representation.
 **/
export const useModalContext = (): ModalContextProps => {
    // A stack of modal IDs. These should reflect a stacked opening of modals on top of each other.
    // It is kept in a ref, so that it can always be read synchronously, even directly after
    // `setModalOpen` was called.
    const currentOpenModalStack = React.useRef<string[]>([]);
    // Counts the changes of the stack. This way a changed stack re-renders all consumers of the
    // context, e.g. modals that are not the top most one anymore.
    const [stackChangeCount, setStackChangeCount] = React.useState<number>(0);

    const setModalOpen = React.useCallback((modalId: string, isOpen: boolean) => {
        const updatedStack = updatedOpenModalStack(currentOpenModalStack.current, modalId, isOpen);
        if (updatedStack !== currentOpenModalStack.current) {
            currentOpenModalStack.current = updatedStack;
            setStackChangeCount((count) => count + 1);
        }
    }, []);

    const openModalStack = React.useCallback(
        () => {
            return currentOpenModalStack.current.length ? [...currentOpenModalStack.current] : undefined;
        },
        // the identity changes with every stack change, so consumers receive a changed context value
        [stackChangeCount],
    );

    // the context value only changes when the stack itself changed, so consumers are not
    // re-rendered by unrelated re-renders of the providing component
    return React.useMemo(
        () => ({
            openModalStack,
            setModalOpen,
        }),
        [openModalStack, setModalOpen],
    );
};
