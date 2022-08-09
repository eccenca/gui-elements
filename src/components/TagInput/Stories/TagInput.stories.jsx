import React from "react";
import Tag from "../../Tag/Tag";
import TextField from "../../TextField/TextField";
import { helpersArgTypes } from "../../../../.storybook/helpers";


export default {
    title: "Components/TagInput",
    component:  TextField,
    argTypes: {
        children : {control : 'text'},
        },
        icon: {
            description: "Icon element to render before the children.",
            ...helpersArgTypes.exampleIcon,
        },
    }

    const TemplateIcons = (args) => (
        <>
        <TextField {...args} />
        </>
    );
    export const Default = TemplateIcons.bind({});
    Default.args = {
        className : '',
        Data : ["TagLabel1", "TagLabel2", "TagLabel3", "TagLabel4"]
    };