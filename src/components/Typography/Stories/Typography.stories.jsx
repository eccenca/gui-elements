import React from "react"
import HtmlContentBlock from '../HtmlContentBlock'
import WhiteSpaceContainer from '../WhiteSpaceContainer'
import OverflowText from '../OverflowText'
export default {
    title: "Components/Typography",
    component: HtmlContentBlock,
    argTypes: {
       onClick : {control : 'action'},
       useHtmlElement : {control : "radio" , options : ["p" , "span" , "div"]},
       ellipsis : {control : "radio" , options : ["reverse" , "none"]},
       paddingTop : {control : "radio" , options :["tiny", "small", "regular", "large", "xlarge"]}
    }

}

const TypographyExample = (args) => (
    <>
    <HtmlContentBlock {...args}>
        <WhiteSpaceContainer {...args}>
        <OverflowText 
        {...args} />
         <OverflowText 
        {...args} />
        </WhiteSpaceContainer>
    
    </HtmlContentBlock>
    </>
);


export const Default  = TypographyExample.bind({});
Default.args = {
  children : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  className : '',
  small:false,
  linebreakForced:false,
  linebreakPrevented:false,
  noScrollbarsOnChildren:false,
  inline:true,
  passDown:false
};