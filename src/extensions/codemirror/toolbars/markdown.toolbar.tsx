import React from "react";
import { EditorView } from "codemirror";

import { Button } from "@/components/atoms/Button/Button";
import { IconButton } from "@/components/atoms/Icon";
import { Spacing } from "@/components/atoms/Separation/Spacing";
import { ContextMenu } from "@/components/molecules/ContextOverlay";
import { MenuItem } from "@/components/molecules/Menu";
import { Toolbar, ToolbarSection } from "@/components/molecules/Toolbar";
import MarkdownCommand from "@/extensions/codemirror/toolbars/commands/markdown.command";
import { EditorAppearanceConfigMenu } from "@/extensions/codemirror/toolbars/EditorAppearanceConfigMenu";

interface MarkdownToolbarProps {
    view?: EditorView;
    togglePreviewStatus: () => void;
    showPreview: boolean;
    translate: (key: string) => string | false;
    disabled?: boolean;
    readonly?: boolean;
    configMenu?: React.ReactElement<typeof EditorAppearanceConfigMenu>;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
    view,
    togglePreviewStatus,
    showPreview,
    disabled,
    readonly,
    translate,
    configMenu,
}) => {
    const commandRef = React.useRef<MarkdownCommand | null>(null);

    React.useEffect(() => {
        if (view) {
            commandRef.current = new MarkdownCommand(view);
        }
    }, [view]);

    const getTranslation = (fallback: string): string => {
        const key = fallback.toLowerCase().replace(" ", "-");
        return translate(key) || fallback;
    };

    const { basic, lists, attachments } = MarkdownCommand.commands;
    return (
        <Toolbar noWrap>
            <ToolbarSection canShrink hideOverflow>
                <ContextMenu
                    togglerElement={
                        <Button
                            rightIcon="toggler-showmore"
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
                                    <span
                                        className={
                                            p.startsWith("Head")
                                                ? ["text-2xl", "text-xl", "text-lg", "text-base", "text-sm", "text-xs"][
                                                      i
                                                  ]
                                                : undefined
                                        }
                                    >
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
            {configMenu && (
                <ToolbarSection>
                    <Spacing vertical size="small" hasDivider />
                    {React.cloneElement(configMenu, {
                        ...{
                            ...configMenu.props,
                            contextMenuProps: { disabled: showPreview || disabled ? true : undefined },
                        },
                    })}
                </ToolbarSection>
            )}
        </Toolbar>
    );
};
