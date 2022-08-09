import React from "react"
import Spinner from "../Spinner";
export default {
    title: "Components/Spinner",
    component: Spinner,
 
    argTypes: {
        size : {control : 'radio' , options : ["tiny" , "small" , "medium" , "large" , "xlarge" , "inherit"]},
        color : {control : 'radio' , options : ["inherit" , "primary" , "success" , "warning" , "danger"]},
        position : {control : 'radio' , options : ["local" , "inline" , "global"]},
        stroke : {control : 'radio' , options : ["thin" , "medium" , "bold"]}
    }

}

const SpinnerExample = (args) => (
    <>
  <Spinner {...args}/>
    </>
);


export const Default  = SpinnerExample.bind({});
Default.args = {
    description : '',
    delay : 0,
    className : ''
};
