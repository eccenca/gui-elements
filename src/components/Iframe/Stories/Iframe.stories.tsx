import React from "react" ;
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {IframeModal} from "../IframeModal"
export default {
    title: "Components/Iframe",
    component: IframeModal,
 
    argTypes: {
        useViewportHeight : {control : 'radio' , options :["quarter" , "third", "half" , "full"]},
        className : {control : 'string'},
        title : {control : "text"},
        useAvailableSpace : {control : 'boolean'},
        useContentHeight : {control : "boolean"},
        backgroudColor : {control : "string"},
        src : {control : "string"},
        isOpen : {control : 'boolean'},
        htmlIframeProps : {control : "object"}
    }

}as ComponentMeta<typeof IframeModal>

const IframeExample: ComponentStory<typeof IframeModal> = (args) => (
    <>
  <IframeModal {...args}></IframeModal>
    </>
);


export const Default  = IframeExample.bind({});
Default.args = {
    className : '',
    title : 'Iframe Component',
    useAvailableSpace : true,
    useContentHeight : true,
    backgroundColor : 'red',
    src : "",
    isOpen : true,
    htmlIframeProps : {
        src : "",
        title : "don"
    }
};

