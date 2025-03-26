import React from "react";

import { Toolbar, ToolbarSection } from "../../../components/Toolbar";
import { Icon, IconButton } from "../../../components/Icon";
import { Spacing } from "../../../components/Separation/Spacing";
import { ContextMenu } from "../../../components/ContextOverlay";
import { MenuItem, Menu } from "../../../components/Menu";
import { Button } from "../../../components/Button/Button";

import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

import { EditorView } from "codemirror";
import MarkdownCommand from "./commands/markdown.command";

interface MarkdownToolbarProps {
    view?: EditorView;
    togglePreviewStatus: () => void;
    showPreview: boolean;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ view, togglePreviewStatus, showPreview }) => {
    const commandRef = React.useRef<MarkdownCommand | null>(null);

    React.useEffect(() => {
        if (view) {
            commandRef.current = new MarkdownCommand(view);
        }
    }, [view]);

    const { basic, lists, attachments } = MarkdownCommand.commands;
    return (
        <Toolbar className={`${eccgui}-codeeditor-toolbar`} noWrap>
            <ToolbarSection>
                <ContextMenu
                    togglerElement={
                        <Menu>
                            <MenuItem labelElement={<Icon name="toggler-showmore" />} text="Paragraphs" />
                        </Menu>
                    }
                >
                    <>
                        {MarkdownCommand.commands.paragraphs.map((p, i) => (
                            <MenuItem
                                key={p}
                                text={
                                    <>
                                        <Spacing size="small" />
                                        <p style={p.startsWith("Head") ? { fontSize: 34 - (i * (34 - 13)) / 5 } : {}}>
                                            {p}
                                        </p>
                                        <Spacing size="small" />
                                    </>
                                }
                                onClick={() => commandRef.current?.executeCommand(p)}
                            />
                        ))}
                    </>
                </ContextMenu>
            </ToolbarSection>
            <Spacing vertical hasDivider />

            {[basic, lists, attachments].map((section, i) => {
                return (
                    <ToolbarSection key={i}>
                        {section.map((command) => {
                            return (
                                <IconButton
                                    key={command.title}
                                    name={command.icon}
                                    onClick={() => commandRef.current?.executeCommand(command.title)}
                                    text={command.title}
                                />
                            );
                        })}
                        {i < 2 ? <Spacing vertical hasDivider /> : null}
                    </ToolbarSection>
                );
            })}
            <ToolbarSection canGrow>
                <Spacing vertical size="small" />
            </ToolbarSection>
            <ToolbarSection>
                <Button minimal onClick={togglePreviewStatus}>
                    {showPreview ? "Keep editing" : "Preview"}
                </Button>
            </ToolbarSection>
        </Toolbar>
    );
};
