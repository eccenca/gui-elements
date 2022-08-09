import React from "react"
import {ProgressBar} from '../ProgressBar'
import Spacing from '../../Separation/Spacing'
export default {
    title: "Components/ProgressBar",
    component: ProgressBar,
    argTypes: {
        intent : {control : "none"},
    }

}
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


const ProgressBarExample = (args) => (
    <>
    <h2>{args.displayName}</h2>
    <Spacing/>
    <ProgressBar {...args}></ProgressBar>
    </>
);

const AnimatedExample = (args) => (
    <>
    <h2>{args.displayName}</h2>
    <Spacing/>
    <ProgressBar  {...args}></ProgressBar>
    </>
);
export const Default  = ProgressBarExample.bind({});
Default.args = passArguments


export const AnimatedBar = AnimatedExample.bind({})
AnimatedBar.args = AnimatedPassArguments
