import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button, Divider } from "./../../../../index";
export default {
    title: "Components/Separation/Divider",
    component: Divider,
    argTypes: {
    }
} as ComponentMeta<typeof Divider>

// buttons used for only showing space with elements
const DividerExample: ComponentStory<typeof Divider> = (args) => (
    <>
     <Button children="Example element"/>
     <Divider {...args}/>
     <Button children="Another element"/>
    </>
);

export const Default  = DividerExample.bind({});
Default.args = {
};
