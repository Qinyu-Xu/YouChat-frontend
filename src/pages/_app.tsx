import type { AppProps } from 'next/app'
import {CookiesProvider} from "react-cookie";
import React from "react";
import '@/styles/global.css'
import store from "@/utils/store";
import {Provider} from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <CookiesProvider>
          <Provider store={store}>
              <Component {...pageProps} />
          </Provider>
      </CookiesProvider>
  )
}
