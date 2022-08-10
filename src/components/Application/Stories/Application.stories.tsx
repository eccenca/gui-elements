import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ApplicationContainer from "../ApplicationContainer";
import ApplicationContent from "../ApplicationContent";
import ApplicationHeader from "../ApplicationHeader";
import ApplicationSidebarNavigation from "../ApplicationSidebarNavigation";
import ApplicationTitle from "../ApplicationTitle";
import ApplicationSidebarToggler from "../ApplicationSidebarToggler";
import ApplicationToolbarPanel from "../ApplicationToolbarPanel";
import ApplicationToolbar from "../ApplicationToolbar";
import ApplicationToolbarAction from "../ApplicationToolbarAction";
import ApplicationToolbarSection from "../ApplicationToolbarSection";
import MenuItem from "../../Menu/MenuItem";
import Menu from "../../Menu/Menu";
import Divider from "../../Separation/Divider";
import Spacing from "../../Separation/Spacing";




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
        <ApplicationContainer >
                <ApplicationHeader >
                      <ApplicationTitle {...args}  href={"https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/"} isAlignedWithSidebar={true} children={"LOGO"} isApplicationSidebarExpanded={false}/>
                </ApplicationHeader>
                
                <ApplicationContent>
               
             
                    <ApplicationSidebarNavigation {...args}>
                       <Menu>
                        <MenuItem icon={"application-homepage"} text="Home"/>
                        <Spacing/>
                        <MenuItem icon ={"item-viewdetails"} text="About"/>
                        <Spacing/>
                        <MenuItem icon={ "module-dashboard"} text="Pages"/>
                        <Spacing/>
                        <MenuItem icon={"item-execution"} text="Portfolio"/>
                        <Spacing/>
                        <MenuItem icon ={"item-info"} text="Contact"/>
                       </Menu>
                    </ApplicationSidebarNavigation>
                    <ApplicationContent>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                   </ApplicationContent>

                   
             <ApplicationToolbarPanel {...args}>   

               <ApplicationToolbarSection>
                  <ApplicationToolbar> 
                  <ApplicationToolbarAction {...args}>app</ApplicationToolbarAction> 
                  </ApplicationToolbar>
                </ApplicationToolbarSection>
                <ApplicationToolbarSection>
                  <ApplicationToolbar> 
                  <ApplicationToolbarAction {...args}>app1</ApplicationToolbarAction> 
                  </ApplicationToolbar>
                </ApplicationToolbarSection>
                <ApplicationToolbarSection>
                  <ApplicationToolbar> 
                  <ApplicationToolbarAction {...args}>app2</ApplicationToolbarAction> 
                  </ApplicationToolbar>
                </ApplicationToolbarSection>
                <ApplicationToolbarSection>
                  <ApplicationToolbar> 
                  <ApplicationToolbarAction {...args}>app2</ApplicationToolbarAction> 
                  </ApplicationToolbar>
                </ApplicationToolbarSection>  
              </ApplicationToolbarPanel>
          </ApplicationContent>
               
              
             
       
     </ApplicationContainer>
   
     </>
  
);

export const Default = Template.bind({});
Default.args = {
 isCollapsible: false,
 className : '',
 isApplicationSidebarExpanded : false,
 isApplicationSidebarRail : false,
 isNotDisplayed : false,
 isAlignedWithSidebar:false,
 isPersistent : false,
 isFixedNav : false,
 expanded:false,
 isRail : false,
 isActive : true,
}