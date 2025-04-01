import { type ChangeSpec, EditorSelection } from "@codemirror/state";
import { EditorView } from "codemirror";

import { ValidIconName } from "../../../../components/Icon/canonicalIconNames";

enum Commands {
    header1 = "Heading 1",
    header2 = "Heading 2",
    header3 = "Heading 3",
    header4 = "Heading 4",
    header5 = "Heading 5",
    header6 = "Heading 6",
    codeBlock = "Code block",
    quote = "Block quote",
    bold = "Bold",
    italic = "Italic",
    strike = "StrikeThrough",
    inlineCode = "Inline code",
    unorderedList = "Unordered list",
    orderedList = "Ordered list",
    todoList = "Todo list",
    link = "Link",
    image = "Image",
}

type formatConfig = { start: number; startDelimiter: string; stop?: number; endDelimiter?: string };
type headerLevels = 1 | 2 | 3 | 4 | 5 | 6;
type ListType = "ul" | "ol" | "todo";

//contains all utilities for markdown toolbar
export default class MarkdownCommand {
    private view: EditorView | null = null;

    //list of supported commands as well as the valid icon names.
    public static commands = {
        paragraphs: [
            Commands.header1,
            Commands.header2,
            Commands.header3,
            Commands.header4,
            Commands.header5,
            Commands.header6,
            Commands.quote,
            Commands.codeBlock,
        ],
        basic: [
            { title: Commands.bold, icon: "operation-format-text-bold" },
            { title: Commands.italic, icon: "operation-format-text-italic" },
            { title: Commands.strike, icon: "operation-format-text-strikethrough" },
            { title: Commands.inlineCode, icon: "operation-format-text-code" },
        ] as { title: Commands; icon: ValidIconName }[],
        lists: [
            { title: Commands.unorderedList, icon: "operation-format-list-bullet", moniker: "ul" },
            { title: Commands.orderedList, icon: "operation-format-list-numbered", moniker: "ol" },
            { title: Commands.todoList, icon: "operation-format-list-checked", moniker: "todo" },
        ] as { title: Commands; icon: ValidIconName; moniker: string }[],
        attachments: [
            { title: Commands.link, icon: "operation-link" },
            { title: Commands.image, icon: "item-image" },
        ] as { title: Commands; icon: ValidIconName }[],
    } as const;

    constructor(view: EditorView) {
        this.view = view;
    }

    /**
     * Supported list types are ol, ul, todo.
     * utility helps to determine which at the start of the line
     */
    private getListTypeOfLine = (text: string): [ListType, number?] | undefined => {
        if (!text) return;
        text = text?.trimStart();

        if (text.startsWith("- ")) {
            if (text.startsWith("- [ ] ") || text.startsWith("- [x] ")) return ["todo"];
            return ["ul"];
        }

        const v = text.match(/^(\d+)\. /);

        return v ? ["ol", Number.parseInt(v[1], 10)] : undefined;
    };

    //inserts the list delimiters of "-", "- [ ]" and "{number}."
    private createListDelimiter(text: string, type: string, orderedList: { currentIndex: number }) {
        return text.replace(/^(( *)(-( \[[x ]])?|\d+\.) )?/, (...args) => {
            const { space = "" } = args[args.length - 1];

            let newFlag = "- ";

            if (type === "ol") {
                newFlag = `${orderedList.currentIndex}. `;
                orderedList.currentIndex++;
            } else if (type === "todo") {
                newFlag = "- [ ] ";
            }

            return space + newFlag;
        });
    }

    //factory for different list types.
    private createList = (type: ListType) => {
        if (!this.view) return;
        const view = this.view;
        const doc = view.state.doc;

        const orderedList = { currentIndex: 1 };

        view.dispatch(
            view.state.changeByRange((range) => {
                const text = doc.slice(range.from, range.to);
                const changes: ChangeSpec[] = [];

                let selectionStart: number = range.from;
                let selectionLength: number = range.to - range.from;

                Array.from({ length: text.lines }).forEach((_, index) => {
                    const line = doc.line(doc.lineAt(range.from).number + index);

                    const currentListType = this.getListTypeOfLine(line.text);

                    if (currentListType && currentListType[0] === type) {
                        if (currentListType[0] === "ol" && currentListType[1]) {
                            orderedList.currentIndex = currentListType[1];
                        }

                        return;
                    }
                    const content = this.createListDelimiter(line.text, type, orderedList);

                    const diffLength = content.length - line.length;

                    changes.push({
                        from: line.from,
                        to: line.to,
                        insert: content,
                    });

                    if (index === 0) {
                        selectionStart = selectionStart + diffLength;
                    } else {
                        selectionLength = selectionLength + diffLength;
                    }
                });

                return {
                    changes,
                    range: EditorSelection.range(selectionStart, selectionStart + selectionLength),
                };
            })
        );

        view.focus();
    };

    private enforceCursorFocus = (cursorPosition: number) => {
        if (!this.view) return;
        const view = this.view;
        setTimeout(() => {
            view.dispatch({
                selection: EditorSelection.cursor(cursorPosition),
            });
            view.focus();
        }, 50);
    };

    //supported headers from h1-h6, h6 being the smallest
    private createHeading = (level: headerLevels) => {
        if (!this.view) return;
        const view = this.view;
        const state = view.state;

        const flags = "#".repeat(level) + " ";

        let lastCursorPosition = 0;

        view.dispatch(
            state.changeByRange((range) => {
                const line = state.doc.lineAt(range.from);

                const content = line.text.replace(/^((#+) )?/, flags);

                const diffLength = content.length - line.length;
                lastCursorPosition = line.to + diffLength;
                return {
                    changes: {
                        from: line.from,
                        to: line.to,
                        insert: content,
                    },
                    range: EditorSelection.range(range.anchor + diffLength, range.head + diffLength),
                };
            })
        );

        this.enforceCursorFocus(lastCursorPosition);
    };

    private applyFormatting = ({
        start,
        startDelimiter,
        endDelimiter = startDelimiter,
        stop = start,
    }: formatConfig) => {
        if (!this.view) return;
        const view = this.view;
        const { from, to } = view.state.selection.main;
        const text = view.state.sliceDoc(from, to);
        view.dispatch(
            view.state.changeByRange((range) => {
                return {
                    changes: [{ from: range.from, to: range.to, insert: `${startDelimiter}${text}${endDelimiter}` }],
                    range: EditorSelection.range(range.from + start, range.to + stop),
                };
            })
        );
        view.focus();
    };

    private applyAttachment = (type: Commands.link | Commands.image) => {
        if (!this.view) return;
        const view = this.view;
        const { state } = view;
        const isImageAttachmentType = type === Commands.image;

        const { doc } = state;

        view.dispatch(
            state.changeByRange((range) => {
                const { from, to } = range;

                const text = doc.sliceString(from, to);

                const link = `${isImageAttachmentType ? `!` : ""}[${text}]()`;

                const cursor = from + (text.length ? 3 + text.length : 1 + Number(isImageAttachmentType));

                return {
                    changes: [
                        {
                            from,
                            to,
                            insert: link,
                        },
                    ],
                    range: EditorSelection.range(cursor, cursor),
                };
            })
        );

        view.focus();
    };

    private applyQuoteFormatting = () => {
        if (!this.view) return;
        const view = this.view;
        const { state } = view;
        const { doc } = state;

        let lastCursorPosition = 0;

        view.dispatch(
            view.state.changeByRange((range) => {
                const startLine = doc.lineAt(range.from);

                const text = doc.slice(range.from, range.to);

                const lineCount = text.lines;

                const changes: ChangeSpec[] = [];

                let selectionStart: number = range.from;
                let selectionLength: number = range.to - range.from;

                new Array(lineCount).fill(0).forEach((_, index) => {
                    const line = doc.line(startLine.number + index);

                    if (line.text.startsWith("> ")) {
                        return;
                    }
                    changes.push({
                        from: line.from,
                        insert: "> ",
                    });

                    if (index === 0) {
                        selectionStart = selectionStart + 2;
                    } else {
                        selectionLength += 2;
                    }
                });

                lastCursorPosition = selectionStart + selectionLength;

                return {
                    changes,
                    range: EditorSelection.range(selectionStart, selectionStart + selectionLength),
                };
            })
        );
        this.enforceCursorFocus(lastCursorPosition);
    };

    executeCommand = (command: Commands): true | void => {
        switch (command) {
            case Commands.bold:
                return this.applyFormatting({ start: 2, startDelimiter: "**" });
            case Commands.italic:
                return this.applyFormatting({ start: 1, startDelimiter: "*" });
            case Commands.codeBlock:
                return this.applyFormatting({ start: 3, startDelimiter: "```\n", endDelimiter: "\n```" });
            case Commands.strike:
                return this.applyFormatting({ start: 2, startDelimiter: "~~" });
            case Commands.inlineCode:
                return this.applyFormatting({ start: 1, startDelimiter: "`" });
            case Commands.header1:
            case Commands.header2:
            case Commands.header3:
            case Commands.header4:
            case Commands.header5:
            case Commands.header6:
                return this.createHeading(Number(command.slice(-1)) as headerLevels);
            case Commands.unorderedList:
            case Commands.orderedList:
            case Commands.todoList:
                return this.createList(
                    MarkdownCommand.commands.lists.find((l) => l.title === command)?.moniker as ListType
                );
            case Commands.image:
            case Commands.link:
                return this.applyAttachment(command);
            case Commands.quote:
                return this.applyQuoteFormatting();
            default:
                return; //do nothing;
        }
    };
}
