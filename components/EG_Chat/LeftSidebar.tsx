/* eslint-disable @next/next/no-img-element */
import { FC } from "react";

interface Props {
  lightMode: "light" | "dark";
}

export const LeftSidebar: FC<Props> = ({ lightMode }) => {
  return (
    <div
      className={`relative flex flex-col bg-[#FAFAFA] min-w-full sm:min-w-[260px] sm:max-w-[300px] sm:w-[300px] z-10 sm:relative sm:top-0 absolute top-12 bottom-0`}
    >
      <div className="fixed flex-1 overflow-auto" style={{ width: "inherit" }}>
        <div className="">
          <h1 className="text-3xl font-bold">
            <span className="text-black">earth.</span>
            <span className="text-[#FF5600]">guide</span>
          </h1>
        </div>
        <div className="mt-8">
          <img src="/unicorn.png" alt="Your travel guide" className="w-full" />
        </div>
      </div>
    </div>
  );
};
