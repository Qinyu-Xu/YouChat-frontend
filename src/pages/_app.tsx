import type { AppProps } from 'next/app'
import {CookiesProvider} from "react-cookie";
import React from "react";
import {isBrowser, MyContext} from "@/utils/global";
import '@/styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
    let socket;
    if(isBrowser) socket = new WebSocket('ws://st-im-django-swimtogether.app.secoder.net/ws/message/');
    else socket = undefined;

    return (
        <MyContext.Provider value={socket} >
            <CookiesProvider>
                <Component {...pageProps} />
            </CookiesProvider>
        </MyContext.Provider>
  )
};
