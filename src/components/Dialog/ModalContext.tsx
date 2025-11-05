import React from "react";

export interface ModalContextProps {
    /** Set that a specific modal is currently being open (or closed) */
    setModalOpen: (modalId: string, isOpen: boolean) => void;

    /** The currently opened modals ordered by when they have been opened. Oldest coming first. */
    openModalStack(): string[] | undefined;
}

/** Can be provided in the application to react to modal related changes. */
export const ModalContext = React.createContext<ModalContextProps>({
    setModalOpen: () => {},
    openModalStack: () => [],
});

/** Default implementation for modal context props.
 * Tracks open modals in a stack representation.
 **/
export const useModalContext = (): ModalContextProps => {
    // A stack of modal IDs. These should reflect a stacked opening of modals on top of each other.
    const currentOpenModalStack = React.useRef<string[]>([]);

    const setOpenModalStack = ((stackUpdateFunction: (old: string[]) => string[]) => {
        currentOpenModalStack.current = stackUpdateFunction([...currentOpenModalStack.current])
    })

    const setModalOpen = React.useCallback((modalId: string, isOpen: boolean) => {
        setOpenModalStack(old => {
            if (isOpen) {
                return [...old, modalId];
            } else {
                const idx = old.findIndex((id) => modalId === id);
                switch (idx) {
                    case -1:
                        // Trying to close modal that has not been registered as open!
                        return old;
                    case old.length - 1:
                        return old.slice(0, idx);
                    default:
                        // Modal in between is closed. Consider all modals after it also as closed.
                        return old.slice(0, idx);
                }
            }
        });
    }, []);

    const openModalStack = React.useCallback(() => {
        return currentOpenModalStack.current.length ? [...currentOpenModalStack.current] : undefined
    }, [])

    return {
        openModalStack,
        setModalOpen,
    };
};
