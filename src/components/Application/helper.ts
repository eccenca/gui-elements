import React from "react";

import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import {APPLICATION_CONTAINER_ID} from "./ApplicationContainer";

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

// Prefix of the generated class. This will be combined with the data transfer type.
const APP_DRAG_OVER_CLASS_PREFIX = "appDragOver";
const nonClassChars = /[^-_a-zA-Z0-9]/g;
const DRAG_CLASS_REMOVAL_DELAY = 500

/** Tracks drag operations over the application. Sets different classes to the root div. */
export const useGlobalAppDragMonitor = () => {
    React.useEffect(() => {
        const applicationContainer = document.getElementById(APPLICATION_CONTAINER_ID);
        const body = document.getElementsByTagName("body").item(0)
        let currentTimer: any = undefined;
        let currentClass: string | undefined = undefined;

        const removeDragClass = () => {
            currentClass && body?.classList.remove(currentClass);
            currentClass = undefined;
        };

        const onDragOver = (event: DragEvent) => {
            if (currentTimer) {
                clearTimeout(currentTimer);
            }
            const types = new Set(event.dataTransfer?.types);
            if (types.size === 1) {
                const type = types.values().next().value;
                currentClass = `${APP_DRAG_OVER_CLASS_PREFIX}_${type}`.replaceAll(nonClassChars, "");
                body?.classList.add(currentClass);
                currentTimer = setTimeout(removeDragClass, DRAG_CLASS_REMOVAL_DELAY);
            }
        };

        const onDrop = () => {
            if (currentTimer) {
                clearTimeout(currentTimer);
            }
            removeDragClass();
        };

        if (applicationContainer) {
            applicationContainer.addEventListener("dragover", onDragOver);
            applicationContainer.addEventListener("drop", onDrop);
        }
    }, []);
};
