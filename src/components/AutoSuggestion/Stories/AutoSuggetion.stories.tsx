import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AutoSuggestion from "../AutoSuggestion";





export default {
  title: "Components/AutoSuggetion",
  component: AutoSuggestion,
  argTypes: {
  
  }
  
}  as ComponentMeta<typeof AutoSuggestion>

const Template : ComponentStory<typeof AutoSuggestion> = (args) => {
  return (

   <>
  <AutoSuggestion {...args}/>
   </>
  )
};

export const Default = Template.bind({});

const defaultArgs  ={
 onChange : (elem : any)=>{return elem },
 fetchSuggestions : (item : any , num : any )=> {return {item, num , replacementResults : [
                                                                            {replacements : [
                                                                                  {value : "Micheal" , label : " " , description : "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without"},
                                                                                  {value : "Don" , label : " " , description : "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without"},
                                                                                  {value : "Darci" , label : " " , description : "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without"},
                                                                                  {value : "brooke" , label : " " , description : "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without"},
                                                                                  {value : "Yellow" , label : " " , description : "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without"},
                                                                                  {value : "Green" , label : " " , description : "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without"},
                                                                                  {value : "Red" , label : " " , description : "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without"},
                                                                                  {value : "Blue" , label : " " , description : "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without"}
                                                                            ] , replacementInterval : {from : 0 , length :40 },extractedQuery: " "}]}},
 checkInput : (item : any)=> `inputItem ${item}`,
 onInputChecked : (item : any)=> item,
 onFocusChange : (el : any)=> el,
 useTabForCompletions:true,
  label: 'AutoSuggetion',
  validationErrorText:"Wrong enter",
  clearIconText:"clearData",
  showScrollBar:true,
  placeholder:"Enter Data",
  leftElement : <h1>Left Text</h1>,
  rightElement : <h1>Right Text</h1>,
}

Default.args = defaultArgs




