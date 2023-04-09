import type { AppProps } from 'next/app'
import {CookiesProvider} from "react-cookie";
import React from "react";
import store from "@/utils/store"
import {Provider} from "react-redux";
import '@/styles/global.css'

export default function App({ Component, pageProps }: AppProps) {

    return (
        <Provider store={store} >
            <CookiesProvider>
                <Component {...pageProps} />
            </CookiesProvider>
        </Provider>
  )
};
