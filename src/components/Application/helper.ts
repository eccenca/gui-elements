import React from "react";

import { CLASSPREFIX as eccgui } from "../../configuration/constants";

export const useApplicationHeaderOverModals = (elevate: boolean, className: string) => {
    return React.useEffect(() => {
        const classNames = className ? className.split(" ") : [];
        if (elevate) {
            // add css classes to body element to display ApplicationHeader on top overlays and popovers
            window.document.body.classList.add(`${eccgui}-application--topheader`);
            classNames.forEach((className) => {
                if (className) window.document.body.classList.add(className);
            });
        } else {
            window.document.body.classList.remove(`${eccgui}-application--topheader`);
            classNames.forEach((className) => {
                if (className) window.document.body.classList.remove(className);
            });
        }
    }, [elevate, className]);
};
