import React from "react";
import { Blockquote } from "@blueprintjs/core";
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

This is a paragraph with a [text link](http://example.com/) and a footnote reference [^1].

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
