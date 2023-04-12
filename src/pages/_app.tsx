import type { AppProps } from 'next/app'
import {CookiesProvider} from "react-cookie";
import React from "react";
import {isBrowser, persistor, store} from '@/utils/store';
import { PersistGate } from 'redux-persist/integration/react';
import {Provider} from "react-redux";
import '@/styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
    const socket: any = store.getState().webSocket;
    if(isBrowser && ( socket === null || socket.readyState !== 1 )) {
        store.dispatch({
            type: 'socketConnect',
            data: new WebSocket("wss://st-im-django-swimtogether.app.secoder.net/ws/message/")
        });
    }
    return (
        <Provider store={store} >
            <PersistGate loading={null} persistor={persistor}>
                <CookiesProvider>
                    <Component {...pageProps} />
                </CookiesProvider>
            </PersistGate>
        </Provider>
  )
};
