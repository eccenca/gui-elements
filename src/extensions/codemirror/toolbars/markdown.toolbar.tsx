import React from "react";
import { EditorView } from "codemirror";

import { Button } from "../../../components/Button/Button";
import { ContextMenu } from "../../../components/ContextOverlay";
import { Icon, IconButton } from "../../../components/Icon";
import { MenuItem } from "../../../components/Menu";
import { Spacing } from "../../../components/Separation/Spacing";
import { Toolbar, ToolbarSection } from "../../../components/Toolbar";
import { CLASSPREFIX as eccgui } from "../../../configuration/constants";

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
        <Toolbar className={`${eccgui}-codeeditor__toolbar`} noWrap>
            <ToolbarSection canShrink hideOverflow>
                <ContextMenu
                    togglerElement={
                        <Button
                            rightIcon={<Icon name="toggler-showmore" />}
                            text="Paragraphs"
                            minimal
                            fill
                            ellipsizeText
                            disabled={showPreview}
                        />
                    }
                >
                    {MarkdownCommand.commands.paragraphs.map((p, i) => (
                        <MenuItem
                            key={p}
                            text={
                                <>
                                    <span style={p.startsWith("Head") ? { fontSize: 22 - (i * (22 - 12)) / 5 } : {}}>
                                        {p}
                                    </span>
                                </>
                            }
                            onClick={() => commandRef.current?.executeCommand(p)}
                        />
                    ))}
                </ContextMenu>
            </ToolbarSection>
            <ToolbarSection canShrink>
                <Spacing vertical hasDivider size="tiny" />
            </ToolbarSection>

            {[basic, lists, attachments].map((section, i) => {
                return (
                    <React.Fragment key={i}>
                        <ToolbarSection>
                            {section.map((command) => {
                                return (
                                    <IconButton
                                        key={command.title}
                                        name={command.icon}
                                        onClick={() => commandRef.current?.executeCommand(command.title)}
                                        text={command.title}
                                        disabled={showPreview}
                                    />
                                );
                            })}
                        </ToolbarSection>
                        {i < 2 && (
                            <ToolbarSection canShrink>
                                <Spacing vertical hasDivider size="tiny" />
                            </ToolbarSection>
                        )}
                    </React.Fragment>
                );
            })}
            <ToolbarSection canGrow canShrink>
                <Spacing vertical size="small" />
            </ToolbarSection>
            <ToolbarSection canShrink hideOverflow>
                <Button
                    minimal
                    ellipsizeText
                    onClick={togglePreviewStatus}
                    text={showPreview ? "Continue editing" : "Preview"}
                    icon={showPreview ? "item-edit" : "item-viewdetails"}
                />
            </ToolbarSection>
        </Toolbar>
    );
};
