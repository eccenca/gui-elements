import React from "react";

import { ReactFlowHotkeyContext } from "@/cmem/react-flow/extensions/ReactFlowHotkeyContext";
import getColorConfiguration from "@/common/utils/getColorConfiguration";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon";
import Tag from "@/components/atoms/Tag/Tag";
import TagList from "@/components/atoms/Tag/TagList";
import { SimpleDialog, SimpleDialogProps } from "@/components/molecules/Dialog";
import { FieldItem } from "@/components/molecules/Form";
import { CodeEditor } from "@/extensions";
import { CodeEditorProps } from "@/extensions/codemirror/CodeMirror";

export type StickyNoteModalTranslationKeys = "modalTitle" | "noteLabel" | "colorLabel" | "saveButton" | "cancelButton";

export type StickyNoteMetadataType = { note: string; color: string };

export interface StickyNoteModalProps {
    /**
     * sticky data containing the sticky note and the selected color
     */
    metaData?: StickyNoteMetadataType;
    /**
     * utility to close the sticky note modal when cancelled as well as closed also
     */
    onClose: () => void;
    /**
     * utility to save recently entered metadata for sticky
     *  note and add on to the canvas
     */
    onSubmit: (data: StickyNoteMetadataType) => void;
    /**
     * translation utility for language compatibility
     */
    translate: (key: StickyNoteModalTranslationKeys) => string;
    /**
     * Forward other properties to the `SimpleModal` element that is used for this dialog.
     */
    simpleDialogProps?: Omit<
        SimpleDialogProps,
        "size" | "title" | "hasBorder" | "isOpen" | "onClose" | "actions" | "children"
    >;
    /**
     * Code editor props
     */
    codeEditorProps?: Omit<CodeEditorProps, "defaultValue" | "onChange" | "preventLinuNumbers" | "id" | "name">;
}

export const StickyNoteModal: React.FC<StickyNoteModalProps> = React.memo(
    ({ metaData, onClose, onSubmit, translate, simpleDialogProps, codeEditorProps }) => {
        const refNote = React.useRef<string>(metaData?.note ?? "");
        const [color, setSelectedColor] = React.useState<string>(metaData?.color ?? "");
        const noteColors: [string, string][] = Object.entries(getColorConfiguration("stickynotes")).map(
            ([key, value]) => [key, value as string],
        );
        const { disableHotKeys } = React.useContext(ReactFlowHotkeyContext);

        React.useEffect(() => {
            disableHotKeys(true);

            return () => {
                disableHotKeys(false);
            };
        }, []);

        React.useEffect(() => {
            // `getColorConfiguration` (a CSSOM scraper) can silently return nothing — e.g. in jsdom
            // or when the sticky-note color stylesheet is not readable — leaving `noteColors` empty.
            // Guard the lookup so the modal still renders instead of crashing on `noteColors[0][1]`.
            const defaultColor = noteColors[0]?.[1];
            if (!color && defaultColor) {
                setSelectedColor(defaultColor);
            }
        }, [color, noteColors]);

        const predefinedColorsMenu = (
            <TagList>
                {noteColors &&
                    noteColors.map(([colorName, colorValue]) => {
                        const selectedFeedback =
                            color === colorValue
                                ? {
                                      icon: <Icon name="state-checkedsimple" />,
                                      large: true,
                                  }
                                : {};
                        return (
                            <Tag
                                round
                                onClick={() => setSelectedColor(colorValue)}
                                backgroundColor={colorValue}
                                {...selectedFeedback}
                                key={colorName}
                            />
                        );
                    })}
            </TagList>
        );

        return (
            <SimpleDialog
                size="small"
                title={translate("modalTitle")}
                hasBorder
                isOpen
                onClose={onClose}
                actions={[
                    <Button
                        key="submit"
                        data-test-id="sticky-submit-btn"
                        affirmative
                        onClick={() => {
                            onSubmit({ note: refNote.current, color: color || "#444444" });
                            onClose();
                        }}
                    >
                        {translate("saveButton")}
                    </Button>,
                    <Button key="cancel" onClick={onClose}>
                        {translate("cancelButton")}
                    </Button>,
                ]}
                {...simpleDialogProps}
            >
                <FieldItem
                    key="note"
                    labelProps={{
                        htmlFor: "noteinput",
                        text: translate("noteLabel"),
                    }}
                >
                    <CodeEditor
                        name={translate("noteLabel")}
                        id={"sticky-note-input"}
                        mode="markdown"
                        useToolbar
                        onChange={(value) => {
                            refNote.current = value;
                        }}
                        defaultValue={refNote.current}
                        {...codeEditorProps}
                    />
                </FieldItem>
                <FieldItem
                    key="color"
                    labelProps={{
                        htmlFor: "colorinput",
                        text: translate("colorLabel"),
                    }}
                >
                    {predefinedColorsMenu}
                </FieldItem>
            </SimpleDialog>
        );
    },
);
