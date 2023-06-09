/* eslint-disable @next/next/no-img-element */
import { FC } from "react";

interface Props {
  lightMode: "light" | "dark";
}

export const LeftSidebar: FC<Props> = ({ lightMode }) => {
  return (
    <div
      className={`relative flex flex-col bg-[#FAFAFA] min-w-full sm:min-w-[150px] sm:max-w-[260px] sm:w-[260px] z-10 sm:relative sm:top-0 absolute top-12 bottom-0`}
    >
      <div className="overflow-auto">
        <div className="max-w-[180px]">
          <img
            src="/earth-guide.svg"
            alt="Your travel guide"
            className="w-full"
          />
        </div>
        <div className="mt-8">
          <img src="/unicorn.png" alt="Your travel guide" className="w-full" />
        </div>
      </div>
    </div>
  );
};
