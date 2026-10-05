import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";
import { Meta, StoryFn } from "@storybook/react";

import { ApplicationViewability } from "../../../index";
import { Link } from "../../Link/Link";
import { HtmlContentBlock } from "../../Typography/HtmlContentBlock";
export default {
    title: "Components/Application/Viewability",
    component: ApplicationViewability,
    argTypes: {
        children: {
            control: false,
        },
        hide: {
            control: {
                type: "radio",
            },
            options: ["print", "screen"],
        },
        show: {
            control: {
                type: "radio",
            },
            options: ["print", "screen"],
        },
    },
} as Meta<typeof ApplicationViewability>;

const TemplateBasicExample: StoryFn<typeof ApplicationViewability> = (args) => <ApplicationViewability {...args} />;

export const Default = TemplateBasicExample.bind({});
Default.args = {
    children: (
        <HtmlContentBlock>
            <LoremIpsum random={false} />
            <p>
                <Link href={"https://example.com/"}>Link title</Link>
            </p>
        </HtmlContentBlock>
    ),
};
