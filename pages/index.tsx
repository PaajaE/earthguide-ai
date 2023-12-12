import Script from 'next/script'
import Main from '@/components/main'
import { airlinesData } from '@/utils/data/airlines';

export default function Home() {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-JFYCT54QGC" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-JFYCT54QGC');
        `}
      </Script>
      <Main airlineData={airlinesData.default} />
    </>
  );
}
