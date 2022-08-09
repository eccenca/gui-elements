import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ApplicationContainer from "../ApplicationContainer";
import ApplicationContent from "../ApplicationContent";
import ApplicationHeader from "../ApplicationHeader";
import ApplicationSidebarNavigation from "../ApplicationSidebarNavigation";
import ApplicationTitle from "../ApplicationTitle";
import ApplicationSidebarToggler from "../ApplicationSidebarToggler";
import ApplicationToolbarPanel from "../ApplicationToolbarPanel";




export default {
    title : 'Components/AppliationStructure',
    component : ApplicationContainer,
    subComponents : {ApplicationContent,
        ApplicationHeader,
        ApplicationSidebarNavigation},
        argTypes : {

        }
} as ComponentMeta<typeof ApplicationContainer>;

const Template : ComponentStory<typeof ApplicationContainer> = (args) => (
  
       
       <>
      <ApplicationContainer {...args}>
      <ApplicationSidebarToggler isApplicationSidebarExpanded {...args}/>
      <ApplicationSidebarNavigation  {...args}>
        <ApplicationHeader>point one </ApplicationHeader>
        <ApplicationHeader>point two </ApplicationHeader>
        <ApplicationHeader>point three </ApplicationHeader>
        <ApplicationHeader>point four </ApplicationHeader>
      </ApplicationSidebarNavigation>
       
   
     <ApplicationContent  {...args}> 
    
     </ApplicationContent>
     </ApplicationContainer>
   
     </>
  
);

export const Default = Template.bind({});
Default.args = {
    // isActive: false,
    isCollapsible: false,
 
 className : '',
 isApplicationSidebarExpanded : false,
 isApplicationSidebarRail : false,
 isNotDisplayed : false,
 isAlignedWithSidebar:false,
 isPersistent : false,
 isFixedNav : false,

}