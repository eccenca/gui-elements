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
export const useDropzoneMonitor = (enabledTypes: string[]) => {
    React.useEffect(() => {
        const monitor = window.document.body;
        let timestampMonitorEnabled = 0;
        let processDragleave: any;

        const addMonitor = (event: DragEvent) => {
            // stop default, so that also no files cannot executed by browser without demand
            event.preventDefault();

            if (processDragleave) {
                // stop removeMonitor process if it happend shortly before
                clearTimeout(processDragleave);
            }

            // only process if monitor is not already enabled
            if (timestampMonitorEnabled > 0) {
                return;
            }

            // stop the event here to prevent double execution
            event.stopImmediatePropagation();

            // enable monitoring only for supported types of dragged elements
            const types = event.dataTransfer?.types || [];
            const monitorTypes = [...new Set(types.filter((type) => enabledTypes.includes(type)))];
            if (monitorTypes.length > 0 && !monitor.dataset.monitorDropzone) {
                monitor.dataset.monitorDropzone = monitorTypes.join(" ");
            }

            timestampMonitorEnabled = Date.now();
        };

        const removeMonitor = (event: DragEvent) => {
            const removeAction = () => {
                delete monitor.dataset.monitorDropzone;
                event.preventDefault();
                timestampMonitorEnabled = 0;
            };

            if (event.type === "dragleave") {
                // use timeout function for dragleave to prevent useless removeMonitor actions
                processDragleave = setTimeout(removeAction, 250);
            } else {
                removeAction();
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
