import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { IconButton, Tag, TagList } from "../../../index";
import { ActivityControlWidget, ActivityControlWidgetAction } from "../ActivityControlWidget";

describe("ActivityControlWidget", () => {
    it("Renders basic widget with actions and handles clicks", () => {
        const mockAction1 = jest.fn();
        const mockAction2 = jest.fn();
        const actions: ActivityControlWidgetAction[] = [
            {
                "data-testid": "action-1",
                icon: "item-reload",
                action: mockAction1,
                tooltip: "Action 1",
            },
            {
                "data-testid": "action-2",
                icon: "item-start",
                action: mockAction2,
                tooltip: "Action 2",
            },
        ];

        render(
            <ActivityControlWidget
                label="Basic widget"
                data-testid="basic-widget"
                activityActions={actions}
                statusMessage="Status message"
            />
        );

        const button1 = screen.getByTestId("action-1");
        const button2 = screen.getByTestId("action-2");

        const label = screen.getByTestId("basic-widget-label");
        const statusMessage = screen.getByTestId("basic-widget-status-message");
        const actionsContainer = screen.getByTestId("basic-widget-actions");

        expect(label).toBeInTheDocument();
        expect(statusMessage).toBeInTheDocument();
        expect(actionsContainer).toBeInTheDocument();

        expect(label).toHaveTextContent("Basic widget");
        expect(statusMessage).toHaveTextContent("Status message");

        expect(button1).toBeInTheDocument();
        expect(button2).toBeInTheDocument();

        fireEvent.click(button1);
        expect(mockAction1).toHaveBeenCalledTimes(1);

        fireEvent.click(button2);
        expect(mockAction2).toHaveBeenCalledTimes(1);
    });

    it("Renders widget with tags", () => {
        const tags = (
            <TagList>
                <Tag>Tag one</Tag>
                <Tag>Other tag</Tag>
            </TagList>
        );
        render(<ActivityControlWidget label="Widget with tags" tags={tags} data-testid="widget-with-tags" />);

        const label = screen.getByTestId("widget-with-tags-label");
        const statusMessage = screen.getByTestId("widget-with-tags-status-message");

        expect(label).toBeInTheDocument();
        expect(statusMessage).toBeInTheDocument();

        expect(label).toHaveTextContent("Widget with tags");
        expect(statusMessage).toHaveTextContent("Tag one");
        expect(statusMessage).toHaveTextContent("Other tag");
    });

    it("Renders widget with additional actions and handles click", () => {
        const mockAction = jest.fn();
        const additionalActions = [
            <IconButton
                key="add-btn"
                name="application-explore"
                onClick={mockAction}
                data-testid="additional-action"
            />,
        ];
        render(<ActivityControlWidget additionalActions={additionalActions} />);

        const customButton = screen.getByTestId("additional-action");
        expect(customButton).toBeInTheDocument();

        fireEvent.click(customButton);
        expect(mockAction).toHaveBeenCalledTimes(1);
    });
});
