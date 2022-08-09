import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AutoSuggestion, { ISuggestionWithReplacementInfo } from "../AutoSuggestion";
import { AutoSuggestionList, IDropdownProps } from "../AutoSuggestionList";



export default {
  title: "Components/AutoSuggetion",
  component: AutoSuggestion,
  subcomponents: { AutoSuggestionList },
  argTypes: {
    onChange : {control : "action"},
    fetchSuggestions : {control : 'action'}
  }
  
}

const Template = (args) => (
   <>
  <AutoSuggestion {...args}  label={'textField'} id={'chary'} validationErrorText="this is error" clearIconText="clearData" showScrollBar={true} placeholder="enter any data" initialValue={"initial_Name"} leftElement={<h2>hey man</h2>} rightElement={<h2>right element</h2>}/>
   </>
);

export const Default = Template.bind({});
const defaultArgs  ={
//  onChange : elem=> {
//   console.log(elem)
//  },
 fetchSuggestions : (item)=> `fetchedItem : ${item}`,
 checkInput : (item)=> `inputItem ${item}`,
 onInputChecked : (item)=> item,
 onFocusChange : (el)=> el
}

Default.args = defaultArgs




// options : [{value : 'chary' , label : "main Label" , description : "this is discription for the  chary"},{value : 'chary' , label : "main Label" , description : "this is discription for the  chary"},{value : 'chary' , label : "main Label" , description : "this is discription for the  chary"},{value : 'chary' , label : "main Label" , description : "this is discription for the  chary"}] ,
//  onItemSelectionChange : (item) => item,
//  isOpen : true,
//  loading : false,
//  left : 12,

//  itemToHighlight : (item) => item