'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import Main from '@/components/main';
import { airlinesData } from '@/utils/data/airlines';
import Head from 'next/head';

export default function Page() {
  const path = usePathname()?.substring(1);

  const data = path ? airlinesData[path] : airlinesData.default;

  useEffect(() => {
    const root_theme: HTMLElement | null =
      document.querySelector(':root');
    if (root_theme) {
      data.styles.forEach((styleItem) => {
        root_theme.style.setProperty(styleItem.key, styleItem.value);
      });
    }
  });

  return (
    <>
      <Head>
        <meta name="description" content="Your AI travel advisor" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta property="og:title" content={data.title} />
        <meta
          property="og:description"
          content={data.starterMessage}
        />
        <meta
          property="og:image"
          content={
            process.env.NEXT_PUBLIC_DEPLOY_URL
              ? `${process.env.NEXT_PUBLIC_DEPLOY_URL}${data.logo}`
              : ''
          }
        />
        <link rel="icon" href={data.icon} />
      </Head>
      {path ? (
        <Main specificAirlines={path} airlineData={data} />
      ) : (
        <></>
      )}
    </>
  );
}
