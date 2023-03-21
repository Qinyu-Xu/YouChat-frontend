import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {AuthProvider} from "@/utils/auth_provider";
import ReactDOM from "react-dom";
import React from "react";



export default function App({ Component, pageProps }: AppProps) {
  return (
      <AuthProvider>
          <Component {...pageProps} />
      </AuthProvider>
  )
}
