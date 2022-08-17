import React from "react"
import {ProgressBar} from '../ProgressBar'
import Spacing from '../../Separation/Spacing'
import { ComponentStory, ComponentMeta } from "@storybook/react";
export default {
    title: "Components/ProgressBar",
    component: ProgressBar,
    argTypes: {
        intent : {control : "none"},
        value : {control : "text"},
        stripes : {control : 'boolean'},
        animate : {control : "boolean"}
    }

} as ComponentMeta<typeof ProgressBar>
const passArguments ={
    displayName : 'ProgressBar',
    value : 0.2,
    stripes: false,
    animate : false
};
const AnimatedPassArguments ={
    displayName : 'Animated progessbar',
    value : 0.8,
    stripes: true,
    animate : true
};


const ProgressBarExample : ComponentStory<typeof ProgressBar> = (args) => (
    <>
    <h2>Progress bar</h2>
    <Spacing/>
    <ProgressBar {...args}></ProgressBar>
    </>
);

const AnimatedExample : ComponentStory<typeof ProgressBar> = (args) => (
    <>
    <h2>Animated progress bar</h2>
    <Spacing/>
    <ProgressBar  {...args}></ProgressBar>
    </>
);
export const Default  = ProgressBarExample.bind({});
Default.args = passArguments


export const AnimatedBar = AnimatedExample.bind({})
AnimatedBar.args = AnimatedPassArguments
