import React from "react";

export interface ModalContextProps {
    /** Set that a specific modal is currently being open (or closed) */
    setModalOpen: (modalId: string, isOpen: boolean) => void;

    /** The currently opened modals ordered by when they have been opened. Oldest coming first. */
    openModalStack: string[] | undefined;
}

/** Can be provided in the application to react to modal related changes. */
export const ModalContext = React.createContext<ModalContextProps>({
    setModalOpen: () => {},
    openModalStack: [],
})
