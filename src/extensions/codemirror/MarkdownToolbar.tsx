import React from "react";
import { markdownItems } from "codemirror-toolbar";

import { Toolbar, ToolbarSection } from "../../components/Toolbar";
import { Icon, IconButton } from "../../components/Icon";
import { Spacing } from "../../components/Separation/Spacing";
import { ContextMenu } from "../../components/ContextOverlay";
import { MenuItem, Menu } from "../../components/Menu";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

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

const [standardButtons, headers, [, ...lists], attachments] = markdownItems.slice(0, 19).reduce(
    (acc, entry: any) => {
        entry.type ? acc.push([]) : acc[acc.length - 1].push(entry);
        return acc;
    },
    [[]] as any[][]
);
const otherToolbarItems = [standardButtons, lists, attachments];

export const MarkdownToolbar = () => {
    const handleToolBarClick = React.useCallback((label: string) => {
        const toolbarItem = document.querySelector(`button[title="${label}"]`) as HTMLElement;
        toolbarItem?.click();
    }, []);

    return (
        <Toolbar className={`${eccgui}-codeeditor-toolbar`} noWrap>
            <ToolbarSection>
                <ContextMenu
                    togglerElement={
                        <Menu>
                            <MenuItem labelElement={<Icon name="toggler-showmore" />} text="Headers" />
                        </Menu>
                    }
                >
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
