import { CLASSPREFIX as eccgui } from "../../configuration/constants";

const getGlobalConfig = () => {
    if (typeof window[eccgui] === "undefined") {
        window[eccgui] = {};
    }
    return window[eccgui];
};

export const getGlobalVar = (varname: string) => {
    return getGlobalConfig()[varname] ?? undefined;
};

export const setGlobalVar = (varname: string, value: any) => {
    if (getGlobalConfig()) {
        window[eccgui][varname] = value;
    }
};
