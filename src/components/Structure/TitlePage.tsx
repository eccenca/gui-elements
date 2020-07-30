import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function TitlePage ({
    children,
    className = '',
    ...restProps
}: any) {
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
