import React, { createContext, FC } from "react";

const SimpleDialogContext = createContext<boolean>(false);

export const SimpleDialogContextProvider: FC = ({ children }) => {
    return <SimpleDialogContext.Provider value={true}>{children}</SimpleDialogContext.Provider>;
};

export const useSimpleDialogContext = () => {
    return React.useContext(SimpleDialogContext);
};
