import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export interface TitlePageProps extends React.HTMLAttributes<HTMLElement> {};

export const TitlePage = ({
    children,
    className = '',
    ...restProps
}: TitlePageProps) => {
    let htmlElement = React.createElement('div');
    const childrenArray = React.Children.toArray(children);

    if (
        childrenArray.length === 1 &&
        typeof childrenArray[0] === 'string'
    ) {
        htmlElement = React.createElement('h1');
    }

    return (
        <htmlElement.type
            {...restProps}
            className={`${eccgui}-structure__title-page ` + className}
        >
            {children}
        </htmlElement.type>
    );
}

export default TitlePage;
