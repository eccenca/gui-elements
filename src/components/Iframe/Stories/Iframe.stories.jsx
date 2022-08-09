import React from "react"
import {IframeModal} from "../IframeModal"
export default {
    title: "Components/Iframe",
    component: IframeModal,
 
    argTypes: {
        useViewportHeight : {control : 'radio' , options :["quarter" , "third", "half" , "full"]}
    }

}

const IframeExample = (args) => (
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
    src : "https://www.youtube.com/embed?v=s-bZD3O3P80",
    isOpen : true,
    htmlIframeProps : {
        src : "https://www.youtube.com/",
        title : "don"
    }
};

