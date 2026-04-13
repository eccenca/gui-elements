import React from "react";

import { ContextMenu, ContextMenuProps, MenuItem } from "../../../components";

export interface EditorAppearanceConfigMenuProps {
    /** Object containing a `true`/`false` value for each property */
    config: { [s: string]: boolean };
    /** Object containing `true` for each property that cannot be changed by user */
    configLocked?: { [s: string]: boolean | undefined };
    /** Handler that returns a translation for each config property key */
    configPropertyTranslate?: (key: string) => string | false;
    /** Handler to update config after user changes */
    setConfig: React.Dispatch<React.SetStateAction<{ [s: string]: boolean }>>;
    /** Additional properties used for the included `ContextMenu` */
    contextMenuProps?: ContextMenuProps;
}

/**
 * Returns a simple context menu that provides switches to control the editor appearance.
 */
export function EditorAppearanceConfigMenu({
    config,
    configLocked = {},
    configPropertyTranslate = (s) => s,
    setConfig,
    contextMenuProps,
}: EditorAppearanceConfigMenuProps) {
    return (
        <ContextMenu
            togglerElement={"item-settings"}
            {...contextMenuProps}
            disabled={
                contextMenuProps?.disabled ??
                Object.values(config).length ===
                    Object.values(configLocked).filter((value) => {
                        return typeof value !== "undefined";
                    }).length
            }
        >
            {Object.entries(config).map(([key, value]) => {
                return (
                    <MenuItem
                        key={key}
                        roleStructure={"listoption"}
                        selected={value}
                        text={configPropertyTranslate(key) || key}
                        disabled={typeof configLocked[key] !== "undefined"}
                        onClick={() => {
                            setConfig({
                                ...config,
                                [key]: !value,
                            });
                        }}
                    />
                );
            })}
        </ContextMenu>
    );
}
