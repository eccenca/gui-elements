import React from "react";
import {
    ContextMenu,
    IconButton,
    MenuItem,
    OverviewItem,
    OverviewItemActions,
    OverviewItemDescription,
    OverviewItemLine,
    ProgressBar
} from "@gui-elements/index";
import {IProgressBarProps} from "@blueprintjs/core/src/components/progress-bar/progressBar";
import {TestableComponent} from "@gui-elements/src/components/interfaces";

export interface IActivityControlProps extends TestableComponent {
    // The label to be shown
    label: string
    // The progress bar parameters. If this object is missing then no progressbar will be shown.
    progress?: IProgressBarProps
    // The action buttons
    activityActions?: IActivityAction[]
    // Context menu items
    activityContextMenu?: IActivityContextMenu
}

interface IActivityContextMenu extends TestableComponent {
    tooltip?: string
    menuItems: IActivityMenuAction[]
}

export interface IActivityAction extends TestableComponent {
    // The action that should be triggered
    action: () => any
    // The tooltip that should be shown over the action icon
    tooltip?: string
    // The icon of the action button
    icon: string
}

export interface IActivityMenuAction extends IActivityAction, TestableComponent {
    // Optional link
    href?: string
}

/** Shows the status of DataIntegration activities and supports actions on these activities. */
export function ActivityControl(props: IActivityControlProps) {
    const {"data-test-id": dataTestId, progress, activityActions, activityContextMenu} = props

    return <OverviewItem data-test-id={dataTestId}>
        <OverviewItemDescription>
            <OverviewItemLine>
                {props.label}
            </OverviewItemLine>
            <OverviewItemLine>
                {progress && <ProgressBar
                    intent={"success"}
                    animate={false}
                    stripes={false}
                    {...progress}
                />}
            </OverviewItemLine>
        </OverviewItemDescription>
        <OverviewItemActions>
            {activityActions && activityActions.map((action) => {
                return <IconButton
                    key={action.icon}
                    data-test-id={action["data-test-id"]}
                    name={action.icon}
                    text={action.tooltip}
                    onClick={action.action}
                />
            })}
            {activityContextMenu && activityContextMenu.menuItems.length > 0 && <ContextMenu
                data-test-id={activityContextMenu["data-test-id"]}
                togglerText={activityContextMenu.tooltip}
            >
                {activityContextMenu.menuItems.map((menuAction) => {
                    return <MenuItem
                        icon={menuAction.icon}
                        // active={modifiers.active} TODO
                        key={menuAction.icon}
                        onClick={menuAction.action}
                        text={menuAction.tooltip}
                    />
                })}
            </ContextMenu>
            }
        </OverviewItemActions>
    </OverviewItem>
}
