import React from "react";
import { useTranslation } from "react-i18next";
import Tag from "../Tag/Tag";
import TagList from "../Tag/TagList";
import SimpleDialog from "../Dialog/SimpleDialog";
import Icon from "../Icon/Icon";
import Button from "../Button/Button";
import FieldItem from "../Form/FieldItem";
import getColorConfiguration from "../../common/utils/getColorConfiguration";
import { CodeEditor } from "../../extensions/codemirror/CodeMirror";

interface MarkdownModalProps {
    content: Map<string, string>;
    onClose: () => void;
    onSubmit: (data: { note: string; color: string }) => void;
}

/*** Readonly modal for node metadata  */
const MarkdownModal: React.FC<MarkdownModalProps> = ({ content, onClose, onSubmit }) => {
    const [t] = useTranslation();
    const refNote = React.useRef<string>(content.get("note") ?? "");
    const [color, setSelectedColor] = React.useState<string>(content.get("color") ?? "");
    const noteColors = getColorConfiguration("stickynotes");

    const predefinedColorsMenu = (
        <TagList>
            {noteColors &&
                Object.keys(noteColors).map((colorname: string) => {
                    const colorvalue = noteColors[colorname];
                    const selectedFeedback =
                        color === colorvalue
                            ? {
                                  icon: <Icon name="state-checkedsimple" />,
                                  large: true,
                              }
                            : {};
                    return (
                        <Tag
                            round
                            onClick={() => setSelectedColor(colorvalue)}
                            backgroundColor={colorvalue}
                            {...selectedFeedback}
                            key={colorname}
                        />
                    );
                })}
        </TagList>
    );

    return (
        <SimpleDialog
            data-test-id={"sticky-note-modal"}
            size="small"
            title={t("StickNoteModal.title")}
            hasBorder
            isOpen
            onClose={onClose}
            actions={[
                <Button
                    key="submit"
                    affirmative
                    onClick={() => {
                        onSubmit({ note: refNote.current.toString(), color });
                        onClose();
                    }}
                >
                    {t("common.action.save")}
                </Button>,
                <Button key="cancel" onClick={onClose}>
                    {t("common.action.cancel")}
                </Button>,
            ]}
        >
            <FieldItem
                key="note"
                labelAttributes={{
                    htmlFor: t("StickNoteModal.labels.codeEditor"),
                    text: t("StickNoteModal.labels.codeEditor"),
                }}
            >
                <CodeEditor
                    name={t("StickNoteModal.labels.codeEditor")}
                    id={t("StickNoteModal.labels.codeEditor")}
                    mode="markdown"
                    preventLineNumbers
                    onChange={(value) => {
                        refNote.current = value;
                    }}
                    defaultValue={refNote.current}
                />
            </FieldItem>
            <FieldItem
                key="color"
                labelAttributes={{
                    htmlFor: t("StickNoteModal.labels.color"),
                    text: t("StickNoteModal.labels.color"),
                }}
            >
                {predefinedColorsMenu}
            </FieldItem>
        </SimpleDialog>
    );
};

export default MarkdownModal;
