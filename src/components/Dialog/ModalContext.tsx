import React from "react";

interface ModalContextProps {
    /** Set that a specific modal is currently being open (or closed) */
    setModalOpen: (modalId: string, isOpen: boolean) => void;

    /** This is true when any modal is currently open. */
    isOpen: boolean;
}

/** Can be provided in the application to react to modal related changes. */
export const ModalContext = React.createContext<ModalContextProps>({
    setModalOpen: () => {},
    isOpen: false,
})
