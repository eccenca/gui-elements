import { CLASSPREFIX as eccgui } from "../../configuration/constants";

const getGlobalConfig = () => {
    return typeof window[eccgui as any] === "undefined"
        ? Object.defineProperty(window, `${eccgui}`, {
              value: {},
              writable: true,
          })[eccgui as any]
        : window[eccgui as any];
};

export const getGlobalVar = (varname: string) => {
    return getGlobalConfig()[varname as any];
};

export const setGlobalVar = (varname: string, value: any) => {
    return (getGlobalConfig()[varname as any] = value);
};
