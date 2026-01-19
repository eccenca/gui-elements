import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";

import { ContentGroup } from "../../../../index";
import { BasicExample } from "../ContentGroup.stories";

describe("ContentGroup", () => {
    describe("basic rendering", () => {
        it("should render with string title", () => {
            const { container } = render(<ContentGroup title="test title">content</ContentGroup>);

            expect(container.querySelector(".eccgui-contentgroup")).toBeInTheDocument();
            expect(screen.getByText("test title")).toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__header__title")).toBeInTheDocument();
            expect(screen.getByText("content")).toBeInTheDocument();
        });

        it("should render with component title", () => {
            const { container } = render(
                <ContentGroup title={<div className={"my-custom-classname"}>test component title</div>}>
                    content
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-contentgroup")).toBeInTheDocument();
            expect(screen.getByText("test component title")).toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__header")).toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__header__title")).not.toBeInTheDocument();
            expect(container.querySelector(".my-custom-classname")).toBeInTheDocument();
            expect(screen.getByText("content")).toBeInTheDocument();
        });

        it("should render without title", () => {
            const { container } = render(<ContentGroup>content only</ContentGroup>);

            expect(container.querySelector(".eccgui-contentgroup")).toBeInTheDocument();
            expect(screen.getByText("content only")).toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__header")).not.toBeInTheDocument();
        });

        it("should render with BasicExample story args", () => {
            const { container } = render(<ContentGroup {...BasicExample.args} />);

            expect(container.querySelector(".eccgui-contentgroup")).toBeInTheDocument();
            expect(screen.getByText("Content group title")).toBeInTheDocument();
        });

        it("should apply custom className", () => {
            const { container } = render(<ContentGroup className="custom-class">content</ContentGroup>);

            const contentGroup = container.querySelector(".eccgui-contentgroup");
            expect(contentGroup).toHaveClass("custom-class");
        });

        it("should pass data-testid attribute", () => {
            const { container } = render(
                <ContentGroup data-testid="content-group-test" title="test">
                    content
                </ContentGroup>
            );

            expect(container.querySelector('[data-testid="content-group-test"]')).toBeInTheDocument();
        });
    });

    describe("collapse functionality", () => {
        it("should render toggle collapse button when handlerToggleCollapse is provided", () => {
            const handleToggle = jest.fn();
            const { container } = render(
                <ContentGroup title="test" handlerToggleCollapse={handleToggle}>
                    content
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-contentgroup__header__toggler")).toBeInTheDocument();
        });

        it("should not render toggle button when handlerToggleCollapse is not provided", () => {
            const { container } = render(<ContentGroup title="Test">Content</ContentGroup>);

            expect(container.querySelector(".eccgui-contentgroup__header__toggler")).not.toBeInTheDocument();
        });

        it("should call handlerToggleCollapse when toggle button is clicked", () => {
            const handleToggle = jest.fn();
            const { container } = render(
                <ContentGroup title="Test" handlerToggleCollapse={handleToggle}>
                    Content
                </ContentGroup>
            );

            const toggleButton = container.querySelector(".eccgui-contentgroup__header__toggler");
            fireEvent.click(toggleButton!);

            expect(handleToggle).toHaveBeenCalledTimes(1);
        });

        it("should hide content when isCollapsed is true", () => {
            const handleToggle = jest.fn();
            const { container } = render(
                <ContentGroup title="Test" isCollapsed={true} handlerToggleCollapse={handleToggle}>
                    <div data-testid="content">Hidden Content</div>
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-contentgroup__content")).not.toBeInTheDocument();
            expect(screen.queryByTestId("content")).not.toBeInTheDocument();
        });

        it("should show content when isCollapsed is false", () => {
            const handleToggle = jest.fn();
            const { container } = render(
                <ContentGroup title="Test" isCollapsed={false} handlerToggleCollapse={handleToggle}>
                    <div data-testid="content">Visible Content</div>
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-contentgroup__content")).toBeInTheDocument();
            expect(screen.getByTestId("content")).toBeInTheDocument();
        });

        it("should hide action options when collapsed", () => {
            const handleToggle = jest.fn();
            const { container } = render(
                <ContentGroup
                    title="Test"
                    isCollapsed={true}
                    handlerToggleCollapse={handleToggle}
                    actionOptions={<button data-testid="action-btn">Action</button>}
                >
                    Content
                </ContentGroup>
            );

            expect(screen.queryByTestId("action-btn")).not.toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__header__options")).not.toBeInTheDocument();
        });

        it("should show action options when not collapsed", () => {
            const handleToggle = jest.fn();
            const { container } = render(
                <ContentGroup
                    title="Test"
                    isCollapsed={false}
                    handlerToggleCollapse={handleToggle}
                    actionOptions={<button data-testid="action-btn">Action</button>}
                >
                    Content
                </ContentGroup>
            );

            expect(screen.getByTestId("action-btn")).toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__header__options")).toBeInTheDocument();
        });

        it("should use custom textToggleCollapse", () => {
            const handleToggle = jest.fn();
            const { container } = render(
                <ContentGroup title="Test" handlerToggleCollapse={handleToggle} textToggleCollapse="Toggle content">
                    Content
                </ContentGroup>
            );

            const icon = container.querySelector(".eccgui-contentgroup__header__toggler svg");
            expect(icon).toHaveAttribute("description", "Toggle content");
        });

        it("should use default 'Show less' text when not collapsed", () => {
            const handleToggle = jest.fn();
            const { container } = render(
                <ContentGroup title="Test" isCollapsed={false} handlerToggleCollapse={handleToggle}>
                    Content
                </ContentGroup>
            );

            const icon = container.querySelector(".eccgui-contentgroup__header__toggler svg");
            expect(icon).toHaveAttribute("description", "Show less");
        });

        it("should use default 'Show more' text when collapsed", () => {
            const handleToggle = jest.fn();
            const { container } = render(
                <ContentGroup title="Test" isCollapsed={true} handlerToggleCollapse={handleToggle}>
                    Content
                </ContentGroup>
            );

            const icon = container.querySelector(".eccgui-contentgroup__header__toggler svg");
            expect(icon).toHaveAttribute("description", "Show more");
        });
    });

    describe("border styling", () => {
        it("should apply border-main class when borderMainConnection is true", () => {
            const { container } = render(
                <ContentGroup title="Test" borderMainConnection={true}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-contentgroup--border-main")).toBeInTheDocument();
        });

        it("should not apply border-main class when borderMainConnection is false", () => {
            const { container } = render(
                <ContentGroup title="Test" borderMainConnection={false}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-contentgroup--border-main")).not.toBeInTheDocument();
        });

        it("should apply border-sub class when borderSubConnection is true", () => {
            const { container } = render(
                <ContentGroup title="Test" borderSubConnection={true}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-contentgroup--border-sub")).toBeInTheDocument();
        });

        it("should apply border-sub class when borderSubConnection is an array of colors", () => {
            const { container } = render(
                <ContentGroup title="Test" borderSubConnection={["red", "blue"]}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-contentgroup--border-sub")).toBeInTheDocument();
        });

        it("should set custom CSS property for gradient border when borderSubConnection is an array", () => {
            const { container } = render(
                <ContentGroup title="Test" borderSubConnection={["red", "blue"]}>
                    Content
                </ContentGroup>
            );

            const section = container.querySelector(".eccgui-contentgroup");
            const style = (section as HTMLElement)?.style.getPropertyValue("--eccgui-color-contentgroup-border-sub");
            expect(style).toBeTruthy();
        });

        it("should not set gradient border CSS property when borderSubConnection is boolean", () => {
            const { container } = render(
                <ContentGroup title="Test" borderSubConnection={true}>
                    Content
                </ContentGroup>
            );

            const section = container.querySelector(".eccgui-contentgroup");
            const style = (section as HTMLElement)?.style.getPropertyValue("--eccgui-color-contentgroup-border-sub");
            expect(style).toBeFalsy();
        });
    });

    describe("whitespace size", () => {
        const sizes = ["tiny", "small", "medium", "large", "xlarge"] as const;

        sizes.forEach((size) => {
            it(`should apply padding class for whitespaceSize="${size}"`, () => {
                const { container } = render(
                    <ContentGroup title="Test" whitespaceSize={size}>
                        Content
                    </ContentGroup>
                );

                expect(container.querySelector(`.eccgui-contentgroup--padding-${size}`)).toBeInTheDocument();
            });
        });
    });

    describe("headline level", () => {
        it("should render title with correct headline level", () => {
            const { container } = render(
                <ContentGroup title="Test Title" minimumHeadlineLevel={1} level={1}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector("h2")).toBeInTheDocument();
        });

        it("should render title with maximum headline level of 6", () => {
            const { container } = render(
                <ContentGroup title="Test Title" minimumHeadlineLevel={6} level={5}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector("h6")).toBeInTheDocument();
        });

        it("should render title with default minimumHeadlineLevel of 3", () => {
            const { container } = render(
                <ContentGroup title="Test Title" level={1}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector("h4")).toBeInTheDocument();
        });
    });

    describe("context info", () => {
        it("should render context info in header when title is present", () => {
            const { container } = render(
                <ContentGroup title="Test" contextInfo={<span data-testid="context">Context Info</span>}>
                    Content
                </ContentGroup>
            );

            expect(screen.getByTestId("context")).toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__header__context")).toBeInTheDocument();
        });

        it("should render context info in content area when no title", () => {
            const { container } = render(
                <ContentGroup contextInfo={<span data-testid="context">Context Info</span>}>Content</ContentGroup>
            );

            expect(screen.getByTestId("context")).toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__content__context")).toBeInTheDocument();
        });

        it("should render array of context info elements", () => {
            render(
                <ContentGroup
                    title="Test"
                    contextInfo={[
                        <span key="1" data-testid="context-1">
                            Context 1
                        </span>,
                        <span key="2" data-testid="context-2">
                            Context 2
                        </span>,
                    ]}
                >
                    Content
                </ContentGroup>
            );

            expect(screen.getByTestId("context-1")).toBeInTheDocument();
            expect(screen.getByTestId("context-2")).toBeInTheDocument();
        });
    });

    describe("action options", () => {
        it("should render action options in header when title is present", () => {
            const { container } = render(
                <ContentGroup title="Test" actionOptions={<button data-testid="action">Action</button>}>
                    Content
                </ContentGroup>
            );

            expect(screen.getByTestId("action")).toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__header__options")).toBeInTheDocument();
        });

        it("should render action options in content area when no title", () => {
            const { container } = render(
                <ContentGroup actionOptions={<button data-testid="action">Action</button>}>Content</ContentGroup>
            );

            expect(screen.getByTestId("action")).toBeInTheDocument();
            expect(container.querySelector(".eccgui-contentgroup__content__options")).toBeInTheDocument();
        });
    });

    describe("annotation", () => {
        it("should render annotation in content area", () => {
            render(
                <ContentGroup title="Test" annotation={<div data-testid="annotation">Annotation</div>}>
                    Content
                </ContentGroup>
            );

            expect(screen.getByTestId("annotation")).toBeInTheDocument();
        });
    });

    describe("description", () => {
        it("should render info icon when description is provided", () => {
            const { container } = render(
                <ContentGroup title="Test" description="Test description">
                    Content
                </ContentGroup>
            );

            expect(container.querySelector(".dmapp--text-info")).toBeInTheDocument();
        });

        it("should not render info icon when description is not provided", () => {
            const { container } = render(<ContentGroup title="Test">Content</ContentGroup>);

            expect(container.querySelector(".dmapp--text-info")).not.toBeInTheDocument();
        });
    });

    describe("group divider", () => {
        it("should render divider by default", () => {
            const { container } = render(
                <ContentGroup title="Test" handlerToggleCollapse={() => {}}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-separation__divider-horizontal")).toBeInTheDocument();
        });

        it("should hide divider when hideGroupDivider is true", () => {
            const { container } = render(
                <ContentGroup title="Test" handlerToggleCollapse={() => {}} hideGroupDivider={true}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector(".eccgui-separation__divider-horizontal")).not.toBeInTheDocument();
        });
    });

    describe("content props", () => {
        it("should apply contentProps to content container", () => {
            const { container } = render(
                <ContentGroup title="Test" contentProps={{ className: "custom-content-class" }}>
                    Content
                </ContentGroup>
            );

            expect(container.querySelector(".custom-content-class")).toBeInTheDocument();
        });
    });

    describe("ReactElement as title", () => {
        it("should render ReactElement title", () => {
            render(
                <ContentGroup title={<span data-testid="custom-title">Custom Title Element</span>}>
                    Content
                </ContentGroup>
            );

            expect(screen.getByTestId("custom-title")).toBeInTheDocument();
            expect(screen.getByText("Custom Title Element")).toBeInTheDocument();
        });
    });

    describe("custom styles", () => {
        it("should apply custom style prop", () => {
            const { container } = render(
                <ContentGroup title="Test" style={{ backgroundColor: "red" }}>
                    Content
                </ContentGroup>
            );

            const section = container.querySelector(".eccgui-contentgroup") as HTMLElement;
            expect(section.style.backgroundColor).toBe("red");
        });

        it("should merge custom style with gradient border style", () => {
            const { container } = render(
                <ContentGroup title="Test" style={{ backgroundColor: "red" }} borderSubConnection={["blue", "green"]}>
                    Content
                </ContentGroup>
            );

            const section = container.querySelector(".eccgui-contentgroup") as HTMLElement;
            expect(section.style.backgroundColor).toBe("red");
            expect(section.style.getPropertyValue("--eccgui-color-contentgroup-border-sub")).toBeTruthy();
        });
    });
});
