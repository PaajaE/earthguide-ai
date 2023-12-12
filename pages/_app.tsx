import '@/styles/globals.css';
import { OrbitProvider, getTokens } from '@kiwicom/orbit-components';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import React, { useEffect } from 'react';
import vhCheck from 'vh-check';

const inter = Inter({ subsets: ['latin'] });

const customTokens = getTokens({
  palette: {
    product: {
      light: '#9ae5da',
      lightHover: '#7fded0',
      lightActive: '#64d7c6',
      normal: '#00a991',
      normalHover: '#009882',
      normalActive: '#008f7b',
      dark: '#005448',
    },
  },
});

export default function App({ Component, pageProps }: AppProps<{}>) {

  useEffect(() => {
    const test = vhCheck();
    const r: HTMLElement | null = document.querySelector(':root');
    r?.style.setProperty('--window-height', `${test.windowHeight}px`);
  })
  return (
    <OrbitProvider
      useId={React.useId}
      theme={{
        orbit: customTokens,
        rtl: false,
        transitions: false,
        lockScrolling: false,
      }}
    >
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </OrbitProvider>
  );
}
