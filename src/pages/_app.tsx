import type { AppProps } from 'next/app'
import React, {useEffect} from "react";
import {isBrowser, persistor, store} from '@/utils/store';
import { PersistGate } from 'redux-persist/integration/react';
import {Provider} from "react-redux";
import '@/styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
    let socket: any = store.getState().webSocket;

    useEffect(() => {
        if (isBrowser && (socket === null || socket.readyState !== 1)) {
            console.log("connect");
            store.dispatch({
                type: 'socketConnect',
                data: new WebSocket("wss://st-im-django-swimtogether.app.secoder.net/ws/message/")
            });
            socket = store.getState().webSocket;
            if (socket !== null) {
                socket.addEventListener("open", () => {
                    if (store.getState().userId !== 0) {
                        socket.send(JSON.stringify({
                            type: 'user_auth',
                            id: store.getState().userId
                        }));
                    }
                })
            }
        }
    }, []);

    return (
        <Provider store={store} >
            <PersistGate loading={null} persistor={persistor}>
                <Component {...pageProps} />
            </PersistGate>
        </Provider>
  )
};
