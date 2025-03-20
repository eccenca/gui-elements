import React from "react";
import { markdownItems } from "codemirror-toolbar";
import { EditorSelection } from "@codemirror/state";

import { Toolbar, ToolbarSection } from "../../components/Toolbar";
import { Icon, IconButton } from "../../components/Icon";
import { Spacing } from "../../components/Separation/Spacing";
import { ContextMenu } from "../../components/ContextOverlay";
import { MenuItem, Menu } from "../../components/Menu";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { EditorView } from "codemirror";

const toolbarIcons: Record<string, string> = {
    Bold: "text-bold",
    Italic: "text-italic",
    Strike: "text-strikethrough",
    Underline: "text-underline",
    "Unordered List": "list-bullet",
    "Ordered List": "list-numbered",
    "Todo List": "list-checked",
    Link: "operation-link",
    Image: "item-image",
};

const [standardButtons, headers, [blockQuote, ...lists], attachments] = markdownItems.slice(0, 19).reduce(
    (acc, entry: any) => {
        entry.type ? acc.push([]) : acc[acc.length - 1].push(entry);
        return acc;
    },
    [[]] as any[][]
);
//standard buttons exclude underline from markdown items
const otherToolbarItems = [standardButtons.slice(0, 3), lists, attachments];

interface MarkdownToolbarProps {
    view?: EditorView;
}

const customMarkdownCommands = new Map([["code-block", true]]);

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ view }) => {
    const editorViewRef = React.useRef<EditorView | null>();

    React.useEffect(() => {
        editorViewRef.current = view;
    }, [view]);

    const handleCustomCommand = React.useCallback(
        (label: string) => {
            if (!editorViewRef.current) return;
            const view = editorViewRef.current;
            switch (label) {
                case "code-block":
                    const currentRange = view.state.selection.main;

                    if (currentRange.from >= 2) {
                        const charStart = view.state.sliceDoc(currentRange.from - 3, currentRange.from);
                        const chatEnd = view.state.sliceDoc(currentRange.to, currentRange.to + 3);

                        if (charStart === "```" && chatEnd === "```") {
                            view.focus();
                            return;
                        }
                    }

                    view.dispatch(
                        view.state.changeByRange((range) => {
                            return {
                                changes: [
                                    { from: range.from, insert: "```\n" },
                                    { from: range.to, insert: "\n```" },
                                ],
                                range: EditorSelection.range(range.from + 3, range.to + 3),
                            };
                        })
                    );

                    view.focus();
                    return;
                default:
                    null;
            }
        },
        [view]
    );

    const handleToolBarClick = React.useCallback((label: string) => {
        if (customMarkdownCommands.has(label)) return handleCustomCommand(label);
        const toolbarItem = document.querySelector(`button[title="${label}"]`) as HTMLElement;
        toolbarItem?.click();
    }, []);

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
                        {headers.map((hItem: any, index: number) => (
                            <MenuItem
                                key={hItem.label}
                                text={
                                    <>
                                        <Spacing size="small" />
                                        <p style={{ fontSize: 34 - (index * (34 - 13)) / 5 }}>Heading {index + 1}</p>
                                        <Spacing size="small" />
                                    </>
                                }
                                onClick={() => handleToolBarClick(hItem.label)}
                            />
                        ))}
                        <MenuItem text="Block quote" onClick={() => handleToolBarClick(blockQuote.label)} />
                        <MenuItem text="Code block" onClick={() => handleToolBarClick("code-block")} />
                    </>
                </ContextMenu>
            </ToolbarSection>
            <Spacing vertical hasDivider />
            {otherToolbarItems.map((section: any, i: number) => {
                return (
                    <ToolbarSection key={i}>
                        {section.map((item: any) => {
                            return (
                                <IconButton
                                    data-test-id={item.label}
                                    key={item.label}
                                    name={toolbarIcons[item.label] as any}
                                    onClick={() => handleToolBarClick(item.label)}
                                    text={item.label.replace("custom-", "")}
                                />
                            );
                        })}
                        {otherToolbarItems[i + 1] ? <Spacing vertical hasDivider /> : null}
                    </ToolbarSection>
                );
            })}
        </Toolbar>
    );
};
