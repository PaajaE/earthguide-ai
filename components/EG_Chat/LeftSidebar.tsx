/* eslint-disable @next/next/no-img-element */
import { FC } from "react";

interface Props {
  lightMode: "light" | "dark";
}

export const LeftSidebar: FC<Props> = ({ lightMode }) => {
  return (
    <div
      className={`relative flex flex-col bg-[#FAFAFA] min-w-full sm:min-w-[150px] sm:max-w-[320px] sm:w-[320px] z-10 top-4 lg:top-0 lg:bottom-0 mb-8 lg:mb-0`}
    >
      <div className="overflow-auto flex flex-row-reverse lg:flex-col">
        <div className="flex justify-end items-start lg:justify-center w-[50%] lg:w-full lg:max-w-[180px]">
          <img
            src="/earth-guide.svg"
            alt="Your travel guide"
            className="w-full"
          />
        </div>
        <div className="w-[50%] lg:w-full lg:mt-8">
          <img src="/unicorn.png" alt="Your travel guide" className="w-full" />
        </div>
      </div>
    </div>
  );
};
