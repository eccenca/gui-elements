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

/**
 * Tracks drag operations over the application.
 * Sets different data attributes to the body element.
 * They can be used to apply styling rules.
 */
export const useDropzoneMonitor = (ref: React.MutableRefObject<any>) => {
    React.useEffect(() => {
        const elementContainer = ref.current;
        const monitor = window.document.body;

        const addMonitor = (event: DragEvent) => {
            const types = event.dataTransfer?.types || [];
            if (types.length > 0 && !monitor.dataset.monitorDropzone) {
                monitor.dataset.monitorDropzone = types.join(" ");
            }
            event.preventDefault();
        };

        const removeMonitor = (event: DragEvent) => {
            if (event.type === "drop" || monitor === event.target) {
                delete monitor.dataset.monitorDropzone;
                event.preventDefault();
            }
        };

        if (monitor) {
            monitor.addEventListener("dragover", addMonitor);
            monitor.addEventListener("dragleave", removeMonitor);
            monitor.addEventListener("drop", removeMonitor);
            return () => {
                monitor.removeEventListener("dragover", addMonitor);
                monitor.removeEventListener("dragleave", removeMonitor);
                monitor.removeEventListener("drop", removeMonitor);
            };
        }
        return;
    }, []);
};
