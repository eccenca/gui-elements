import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import FieldItem from '../FieldItem'
import FieldItemRow from "../FieldItemRow";
import { Default as FieldItemStory } from "./FieldItem.stories";

export default {
    title: "Components/Form/FieldItemRow",
    component: FieldItemRow,
    argTypes: {
        children: {
            control: "none",
            description: "Elements to include into the Accordion component"
        },
    }

} as ComponentMeta<typeof FieldItemRow>;

const Template: ComponentStory<typeof FieldItemRow> = (args) => (
    <FieldItemRow {...args} />
);  
export const Default = Template.bind({});
Default.args = {
    children : [
        <>
            <FieldItem {...FieldItemStory.args}/>
            <FieldItem {...FieldItemStory.args}/>
            <FieldItem {...FieldItemStory.args}/>
        </>
    ]
};