import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Markdown } from "./../../../index";

export default {
    title: "Cmem/Markdown",
    component: Markdown,
    argTypes: {},
} as Meta<typeof Markdown>;

const Template: StoryFn<typeof Markdown> = (args) => <Markdown {...args} />;

export const Default = Template.bind({});

Default.args = {
    children: `
# This is a headline level 1

This is a paragraph.

* this is a unordered list
    * with sub items
    * with sub items
       * another level
       * another level
    * sub item
* other list item
* a last one

1. ordered list
    1. ordered sub items
    2. second line
2. second item
    * unordered sub items
    * another line
3. third item

This is a paragraph with a [text link](http://example.com/), some \`inline code\`, and a footnote reference [^1].

## Headline level 2
### Headline level 3
#### Headline level 4
##### Headline level 5
###### Headline level 6

    This is a code block.

\`\`\`
another code block
{{templateVar}}
\`\`\`

\`\`\`json
{
    "json": "varname"
}
\`\`\`

> This is a block quote.
>
> With 2 paragraphs.
> And some code like \`{{showThisNotItsValue}}\`

A line with some <strong>HTML code</strong> inside.

[^1]: This is the text related to the the footnote referrer.
    `,
};

export const CutOff = Template.bind({});

CutOff.args = {
    children: `This component renders Markdown content safely. It supports **GitHub Flavoured Markdown**, syntax highlighting for code blocks, and definition lists.

You can:
 * configure _link targets_
 * add custom __rehype__ plugins
 * and filter content through an allowed elements list
A third paragraph that will not appear once the cutOff limit is reached.`,
    cutOff: 300,
};

export const CutOffWithCodeFence = Template.bind({});

CutOffWithCodeFence.args = {
    children: `A short paragraph before the code block.
Here is an important code example:
\`\`\`json
{
    "host": "localhost",
    "port": 8080,
    "debug": true
}
\`\`\`

This paragraph comes after the code block and should not appear when the cutOff limit falls inside the fence above.
    `,
    cutOff: 110,
    cutOffSuffix: "...",
};

export const CutOffWithLinks = Template.bind({});

CutOffWithLinks.args = {
    children: Array.from(
        { length: 20 },
        (_, index) => `[open item ${index + 1}](https://example.com/item/${index + 1})`,
    ).join(" "),
    cutOff: 80,
    cutOffSuffix: "...",
};

export const CutOffWithFenceAndLink = Template.bind({});

CutOffWithFenceAndLink.args = {
    children: `A short paragraph before the code block.

\`\`\`ts
const status = "ready";
const nextStep = "open details";
\`\`\`

~~~ts
some code here
~~~
Continue with the [detailed implementation guide](https://example.com/docs/implementation/very/long/path) after the code block.`,
    cutOff: 153,
    cutOffSuffix: "...",
};

export const CutOffWithTable = Template.bind({});

CutOffWithTable.args = {
    children: `| Name | Value |
| --- | --- |
| Alpha | First visible row |
| Beta | Second visible row |
| Gamma | Row that should not be partially rendered |

This paragraph comes after the table and should not appear in the preview.`,
    cutOff: 90,
    cutOffSuffix: "...",
};
