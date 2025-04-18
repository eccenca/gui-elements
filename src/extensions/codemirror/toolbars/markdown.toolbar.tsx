import React from "react";
import { EditorView } from "codemirror";

import { Button } from "../../../components/Button/Button";
import { ContextMenu } from "../../../components/ContextOverlay";
import { Icon, IconButton } from "../../../components/Icon";
import { MenuItem } from "../../../components/Menu";
import { Spacing } from "../../../components/Separation/Spacing";
import { Toolbar, ToolbarSection } from "../../../components/Toolbar";

import MarkdownCommand from "./commands/markdown.command";

interface MarkdownToolbarProps {
    view?: EditorView;
    togglePreviewStatus: () => void;
    showPreview: boolean;
    translate: (key: string) => string | false;
    disabled?: boolean;
    readonly?: boolean;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
    view,
    togglePreviewStatus,
    showPreview,
    disabled,
    readonly,
    translate
}) => {
    const commandRef = React.useRef<MarkdownCommand | null>(null);

    React.useEffect(() => {
        if (view) {
            commandRef.current = new MarkdownCommand(view);
        }
    }, [view]);

    const getTranslation = (fallback: string) : string => {
        const key = fallback.toLowerCase().replace(" ", "-");
        return translate(key) || fallback;
    }

    const { basic, lists, attachments } = MarkdownCommand.commands;
    return (
        <Toolbar noWrap>
            <ToolbarSection canShrink hideOverflow>
                <ContextMenu
                    togglerElement={
                        <Button
                            rightIcon={<Icon name="toggler-showmore" />}
                            text={getTranslation("Paragraphs")}
                            minimal
                            fill
                            ellipsizeText
                            disabled={showPreview || disabled || readonly}
                        />
                    }
                >
                    {MarkdownCommand.commands.paragraphs.map((p, i) => (
                        <MenuItem
                            key={p}
                            text={
                                <>
                                    <span style={p.startsWith("Head") ? { fontSize: 22 - (i * (22 - 12)) / 5 } : {}}>
                                        {getTranslation(p)}
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
                                        text={getTranslation(command.title)}
                                        disabled={showPreview || disabled || readonly}
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
                    text={showPreview ? getTranslation("Continue editing") : getTranslation("Preview")}
                    icon={showPreview ? "item-edit" : "item-viewdetails"}
                    disabled={disabled}
                />
            </ToolbarSection>
        </Toolbar>
    );
};
