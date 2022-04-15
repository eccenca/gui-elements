import React from "react";
import {
    Card,
    ContextMenu,
    IconButton,
    MenuItem,
    OverflowText,
    OverviewItem,
    OverviewItemActions,
    OverviewItemDepiction,
    OverviewItemDescription,
    OverviewItemLine,
    ProgressBar,
    Spacing,
    Spinner,
    Tooltip,
} from "../../../index";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import { TestableComponent } from "../../components/interfaces";
import { ProgressBarProps } from "../../components/ProgressBar/ProgressBar";
import { SpinnerProps } from "../../components/Spinner/Spinner";
import {ValidIconName} from "../../components/Icon/canonicalIconNames";
import { IconProps } from "../../components/Icon/Icon";

export interface IActivityControlProps extends TestableComponent {
    /**
     * The label to be shown
     */
    label?: string | JSX.Element;
    /**
     * To add tags in addition to the widget status description
     */
    tags?: JSX.Element;
    /**
     * The progress bar parameters if it should be show by a progres bar
     */
    progressBar?: ProgressBarProps;
    /**
     * The spinner parameters if it should be show by a spinner
     */
    progressSpinner?: SpinnerProps;
    /**
     * Status message
     */
    statusMessage?: string;
    /**
     * The action buttons
     */
    activityActions?: IActivityAction[];
    /**
     * Context menu items
     */
    activityContextMenu?: IActivityContextMenu;
    /**
     * show small version of the widget
     */
    small?: boolean;
    /**
     * display widget inside rectangle
     */
    border?: boolean;
    /**
     * only use necessary width, not always the available 100% of parent element
     */
    canShrink?: boolean;
    /**
     * if this is set the spinner is replaced when the progress has finished from 0 - 1
     */
    progressSpinnerFinishedIcon?: React.ReactElement<IconProps>;
}

interface IActivityContextMenu extends TestableComponent {
    // Tooltip for the context menu
    tooltip?: string;
    // The entries of the context menu
    menuItems: IActivityMenuAction[];
}

export interface IActivityAction extends TestableComponent {
    // The action that should be triggered
    action: () => any;
    // The tooltip that should be shown over the action icon
    tooltip?: string;
    // The icon of the action button
    icon: ValidIconName
    // Action is currently disabled (but shown)
    disabled?: boolean;
    // Warning state
    hasStateWarning?: boolean;
}

export interface IActivityMenuAction extends IActivityAction, TestableComponent {
    // Optional link
    href?: string;
}
/** Shows the status of activities and supports actions on these activities. */
export function ActivityControlWidget(props: IActivityControlProps) {
    const {
        "data-test-id": dataTestId,
        progressBar,
        progressSpinner,
        activityActions,
        activityContextMenu,
        small,
        border,
        canShrink,
        tags,
        progressSpinnerFinishedIcon,
    } = props;
    const spinnerClassNames = (progressSpinner?.className ?? "") + ` ${eccgui}-spinner--permanent`;
    const widget = (
        <OverviewItem data-test-id={dataTestId} hasSpacing={border} densityHigh={small}>
            {progressBar && <ProgressBar {...progressBar} />}
            {progressSpinner && (
                <OverviewItemDepiction keepColors>
                    {progressSpinnerFinishedIcon ? (
                        React.cloneElement(progressSpinnerFinishedIcon, { small, large: !small })
                    ) : (
                        <Spinner
                            position="inline"
                            size={small ? "tiny" : "small"}
                            stroke={small ? "bold" : "medium"}
                            {...progressSpinner}
                            className={spinnerClassNames}
                        />
                    )}
                </OverviewItemDepiction>
            )}
            <OverviewItemDescription>
                {props.label && (
                    <OverviewItemLine small={small}>
                        <OverflowText inline={true}>{props.label}</OverflowText>
                    </OverviewItemLine>
                )}
                {(props.statusMessage || tags) && (
                    <OverviewItemLine small>
                        {tags && (
                            <>
                                { tags }
                                <Spacing vertical size="tiny" />
                            </>
                        )}
                        {props.statusMessage && (
                            <>
                                {props.statusMessage.length > 50 ? (
                                    <Tooltip
                                        content={props.statusMessage}
                                        size="large"
                                        tooltipProps={{ placement: "top", boundary: "viewport" }}
                                    >
                                        <OverflowText inline={true}>{props.statusMessage}</OverflowText>
                                    </Tooltip>
                                ) : (
                                    <OverflowText inline={true}>{props.statusMessage}</OverflowText>
                                )}
                            </>
                        )}
                    </OverviewItemLine>
                )}
            </OverviewItemDescription>
            <OverviewItemActions>
                {activityActions &&
                    activityActions.map((action) => {
                        return (
                            <IconButton
                                key={action.icon}
                                data-test-id={action["data-test-id"]}
                                name={action.icon}
                                text={action.tooltip}
                                onClick={action.action}
                                tooltipOpenDelay={200}
                                disabled={action.disabled}
                                hasStateWarning={action.hasStateWarning}
                            />
                        );
                    })}
                {activityContextMenu && activityContextMenu.menuItems.length > 0 && (
                    <ContextMenu
                        data-test-id={activityContextMenu["data-test-id"]}
                        togglerText={activityContextMenu.tooltip}
                    >
                        {activityContextMenu.menuItems.map((menuAction) => {
                            return (
                                <MenuItem
                                    icon={menuAction.icon}
                                    key={menuAction.icon}
                                    onClick={menuAction.action}
                                    text={menuAction.tooltip}
                                />
                            );
                        })}
                    </ContextMenu>
                )}
            </OverviewItemActions>
        </OverviewItem>
    );

    const classname = `${eccgui}-addon-activitycontrol` + (canShrink ? ` ${eccgui}-addon-activitycontrol--shrink` : "");

    return border ? (
        <Card isOnlyLayout elevation={0} className={classname}>
            {widget}
        </Card>
    ) : (
        <div className={classname}>{widget}</div>
    );
}
