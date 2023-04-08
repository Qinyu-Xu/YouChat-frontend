import {createContext} from "react";
export const isBrowser = typeof(window) !== 'undefined';

export let MyContext: any;
if(isBrowser) MyContext = createContext(null);
else MyContext = createContext(undefined);