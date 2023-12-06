/* eslint-disable @next/next/no-img-element */
import { usePathname } from 'next/navigation';
import { FC } from 'react';

interface Props {
  lightMode: 'light' | 'dark';
  logoPath: string;
}

export const LeftSidebar: FC<Props> = ({ lightMode, logoPath }) => {
  const path = usePathname()?.substring(1);

  return (
    <div
      className={`relative flex flex-col bg-transparent min-w-full sm:min-w-[150px] sm:max-w-[320px] sm:w-[320px] lg:w-1/4 lg:max-w-[25%] z-10 top-4 lg:top-0 lg:bottom-0 mb-8 lg:mb-0`}
    >
      <div className="overflow-auto flex flex-row-reverse lg:flex-col">
        <div
          className={`flex items-start lg:justify-center w-full justify-center lg:w-full lg:max-w-[180px]`}
        >
          <img
            src={logoPath}
            alt="Your travel guide"
            className="w-full ml-8"
            // className={`${!path ? 'w-full' : 'w-[70%]'}`}
          />
        </div>
        {/* {!path && (
          <div className={`w-[50%] lg:w-full lg:mt-8`}>
            <img
              src="/unicorn.png"
              alt="Your travel guide"
              className="w-full"
            />
          </div>
        )} */}
      </div>
    </div>
  );
};
