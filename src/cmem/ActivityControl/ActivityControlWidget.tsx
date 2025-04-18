import React from "react";

import { ValidIconName } from "../../components/Icon/canonicalIconNames";
import { IconProps } from "../../components/Icon/Icon";
import { TestIconProps } from "../../components/Icon/TestIcon";
import { TestableComponent } from "../../components/interfaces";
import { ProgressBarProps } from "../../components/ProgressBar/ProgressBar";
import { SpinnerProps } from "../../components/Spinner/Spinner";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
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
    Spinner,
    Tooltip,
} from "../../index";

export interface ActivityControlWidgetProps extends TestableComponent {
    /**
     * The label to be shown
     */
    label?: string | JSX.Element;
    /**
     * Element that wraps around the label.
     * Default: `<OverflowText inline={true} />`
     */
    labelWrapper?: JSX.Element;
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
    activityActions?: ActivityControlWidgetAction[];
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
     * display a bit whitespace around widget, even without border
     */
    hasSpacing?: boolean;
    /**
     * only use necessary width, not always the available 100% of parent element
     */
    canShrink?: boolean;
    /**
     * if this is set the spinner is replaced when the progress has finished from 0 - 1
     */
    progressSpinnerFinishedIcon?: React.ReactElement<IconProps> | React.ReactElement<TestIconProps>;
    /**
     * execution timer messages for waiting and running times.
     */
    timerExecutionMsg?: JSX.Element | null;
}

interface IActivityContextMenu extends TestableComponent {
    // Tooltip for the context menu
    tooltip?: string;
    // The entries of the context menu
    menuItems: IActivityMenuAction[];
}

export interface ActivityControlWidgetAction extends TestableComponent {
    // The action that should be triggered
    action: () => void;
    // The tooltip that should be shown over the action icon
    tooltip?: string;
    // The icon of the action button
    icon: ValidIconName | React.ReactElement<TestIconProps>;
    // Action is currently disabled (but shown)
    disabled?: boolean;
    // Warning state
    hasStateWarning?: boolean;
}

interface IActivityMenuAction extends ActivityControlWidgetAction {
    // Optional link
    href?: string;
}
/** Shows the status of activities and supports actions on these activities. */
export function ActivityControlWidget(props: ActivityControlWidgetProps) {
    const {
        "data-test-id": dataTestId,
        progressBar,
        progressSpinner,
        activityActions,
        activityContextMenu,
        small,
        border,
        hasSpacing,
        canShrink,
        tags,
        progressSpinnerFinishedIcon,
        timerExecutionMsg = "",
        labelWrapper = <OverflowText inline={true} />,
    } = props;
    const spinnerClassNames = (progressSpinner?.className ?? "") + ` ${eccgui}-spinner--permanent`;
    const widget = (
        <OverviewItem data-test-id={dataTestId} hasSpacing={border || hasSpacing} densityHigh={small}>
            {progressBar && <ProgressBar {...progressBar} />}
            {(progressSpinner || progressSpinnerFinishedIcon) && (
                <OverviewItemDepiction keepColors>
                    {progressSpinnerFinishedIcon ? (
                        React.cloneElement(progressSpinnerFinishedIcon as JSX.Element, { small, large: !small })
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
                        {React.cloneElement(labelWrapper, {}, props.label)}
                        {timerExecutionMsg && (props.statusMessage || tags) && <>&nbsp;({timerExecutionMsg})</>}
                    </OverviewItemLine>
                )}
                {(props.statusMessage || tags) && (
                    <OverviewItemLine small>
                        {tags}
                        {props.statusMessage && (
                            <OverflowText passDown>
                                {props.statusMessage.length > 50 ? (
                                    <Tooltip
                                        content={props.statusMessage}
                                        size="large"
                                        placement="top-start"
                                        rootBoundary="viewport"
                                    >
                                        {props.statusMessage}
                                    </Tooltip>
                                ) : (
                                    props.statusMessage
                                )}
                            </OverflowText>
                        )}
                    </OverviewItemLine>
                )}
                {timerExecutionMsg && !(props.statusMessage || tags) && (
                    <OverviewItemLine small>{timerExecutionMsg}</OverviewItemLine>
                )}
            </OverviewItemDescription>
            <OverviewItemActions>
                {activityActions &&
                    activityActions.map((action, idx) => {
                        return (
                            <IconButton
                                key={typeof action.icon === "string" ? action.icon : action["data-test-id"] ?? idx}
                                data-test-id={action["data-test-id"]}
                                name={action.icon}
                                text={action.tooltip}
                                onClick={action.action}
                                disabled={action.disabled}
                                hasStateWarning={action.hasStateWarning}
                                tooltipProps={{
                                    hoverOpenDelay: 200,
                                    placement: "bottom",
                                }}
                            />
                        );
                    })}
                {activityContextMenu && activityContextMenu.menuItems.length > 0 && (
                    <ContextMenu
                        data-test-id={activityContextMenu["data-test-id"]}
                        togglerText={activityContextMenu.tooltip}
                    >
                        {activityContextMenu.menuItems.map((menuAction, idx) => {
                            return (
                                <MenuItem
                                    icon={menuAction.icon}
                                    key={
                                        typeof menuAction.icon === "string"
                                            ? menuAction.icon
                                            : menuAction["data-test-id"] ?? idx
                                    }
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
