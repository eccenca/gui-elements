import React, { memo } from "react";
import { CLASSPREFIX as eccgui } from "@gui-elements/src/configuration/constants";
import { Icon } from "@gui-elements/index";
import { Handle } from "react-flow-renderer";

export interface NodeProps extends React.HTMLAttributes<HTMLElement> {
    size?: "tiny" | "small" | "medium" | "large";
    iconName?: string;
    typeLabel?: string;
    label: string;
    menuButtons?: React.ReactNode;
    content?: React.ReactNode;
    handles?: typeof Handle[];
}

export const NodeRectangular = memo(
    ({
        iconName,
        typeLabel,
        label,
        menuButtons,
        content,
        size = "small",
        handles,
    }: NodeProps) => {
        return (
            <>
                <section
                    className={`${eccgui}-graphviz__node ${eccgui}-graphviz__node--${size}`}
                >
                    <header className={`${eccgui}-graphviz__node__header`}>
                        {iconName && (
                            <span
                                className={`${eccgui}-graphviz__node__header-depiction`}
                            >
                                <Icon name={iconName} tooltipText={typeLabel} />
                            </span>
                        )}
                        <span
                            className={`${eccgui}-graphviz__node__header-label`}
                        >
                            {label}
                        </span>
                        {menuButtons && (
                            <span
                                className={`${eccgui}-graphviz__node__header-menu`}
                            >
                                {menuButtons}
                            </span>
                        )}
                    </header>
                    {content && (
                        <div className={`${eccgui}-graphviz__node__content`}>
                            {content}
                        </div>
                    )}
                </section>
                {handles}
            </>
        );
    }
);

export const NodeSinkRectangular = memo(({ data }: any) => {
    return <NodeRectangular {...data} />;
});
