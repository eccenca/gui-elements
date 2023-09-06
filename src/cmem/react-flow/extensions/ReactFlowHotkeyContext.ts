import React from "react";

export interface ReactFlowHotkeyContextProps {
    /** Allows to disable hot keys. */
    disableHotKeys: (enable: boolean) => any

    /** If the hot keys are currently disabled. */
    hotKeysDisabled: boolean
}

export const ReactFlowHotkeyContext = React.createContext<ReactFlowHotkeyContextProps>({
    disableHotKeys: () => {},
    hotKeysDisabled: false
})
