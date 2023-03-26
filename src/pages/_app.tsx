import type { AppProps } from 'next/app'
import {AuthProvider} from "@/utils/auth_provider";
import React from "react";
import '@/styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
      <AuthProvider>
          <Component {...pageProps} />
      </AuthProvider>
  )
}
